import ENV from 'covid-19-dashboard/config/environment';
const { host, namespace } = ENV.APP;

const operators = {
  eq: '==',
  isIn: '=in=',
  isNull: '=isnull=true',
  notNull: '=isnull=false',
  lt: '=lt=',
  gt: '=gt=',
  le: '=le=',
  ge: '=ge=',
};

const filterRegex = new RegExp(`(.*)(${Object.values(operators).join('|')})(.*)`);

const unEscapeValue = (v) => v.replace(/\\'/g, "'").replace(/\\,/g, ',');

const filterOperations = {
  [operators.eq]: (recValue, filterValue) => {
    const unEscapedValue = unEscapeValue(filterValue);
    const [, like] = unEscapedValue.match(/\*(.*)\*/) || [];
    return like ? recValue.toLowerCase().includes(like.toLowerCase()) : `'${recValue}'` === unEscapedValue;
  },
  [operators.isIn]: (recValue, filterValue) => {
    const [, value] = filterValue.match(/^\((.*)\)$/);
    return unEscapeValue(value)
      .split(',')
      .map((v) => (v.match(/^'(.*)'$/) || [])[1])
      .some((v) => v === recValue);
  },
  [operators.isNull]: (recValue) => recValue === null || recValue === undefined,
  [operators.notNull]: (recValue) => recValue !== null && recValue !== undefined,
  [operators.lt]: (recValue, filterValue) => recValue < filterValue,
  [operators.gt]: (recValue, filterValue) => recValue > filterValue,
  [operators.le]: (recValue, filterValue) => recValue <= filterValue,
  [operators.ge]: (recValue, filterValue) => recValue >= filterValue,
};

const getColumn = (schema, model, fieldName) => {
  const column = {
    field: fieldName,
    relationship: null,
  };

  const relationship = schema.associationsFor(model)[fieldName];
  if (relationship) {
    column.field = relationship.foreignKey;
  }

  if (fieldName.includes('.')) {
    const [relationship, field] = fieldName.split('.');
    Object.assign(column, { relationship, field });
  }
  return column;
};

const getValue = (rec, column, schema, model) => {
  if (column.relationship) {
    const { modelName, foreignKey } = schema.associationsFor(model)[column.relationship];
    const foreignKeyValue = rec[foreignKey];
    return foreignKeyValue ? schema.find(modelName, rec[foreignKey])?.[column.field] : undefined;
  } else {
    return rec[column.field];
  }
};

export default function () {
  this.urlPrefix = host;
  this.namespace = namespace;
  this.get('/:type', (schema, req) => {
    const {
      params: { type },
      queryParams = {},
    } = req;

    const filterParam = queryParams.filter || '';
    const filters = filterParam
      .split(';')
      .filter((filter) => filter)
      .map((filter) => {
        const [, field, operator, value] = filter.match(filterRegex);
        return { field, operator, value };
      });

    const model = schema.toModelName(type);
    let response = schema[type].where((rec) => {
      return filters.every((filter) => {
        const { field, operator, value: filterValue } = filter;
        const column = getColumn(schema, model, field);
        const recValue = getValue(rec, column, schema, model);
        return filterOperations[operator](recValue, filterValue);
      });
    });

    const { sort } = queryParams;
    if (sort) {
      const isDescending = sort.startsWith('-');
      const sortOrder = isDescending ? -1 : 1;
      const field = isDescending ? sort.substring(1) : sort;
      response = response.sort((l, r) => sortOrder * (l[field] - r[field]));
    }

    return response;
  });
}
