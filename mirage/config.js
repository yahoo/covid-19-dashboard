import ENV from 'covid-19-dashboard/config/environment';
import { isPresent, isEmpty } from '@ember/utils';
const { host, namespace } = ENV.APP;

const operators = {
  eq: '==',
  isIn: '=in=',
  isNull: '=isnull=true',
  notNull: '=isnull=false',
  isEmpty: '=isempty=true',
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
    return value
      .split(/^\\,/)
      .map((v) => (v.match(/^'(.*)'$/) || [])[1])
      .some((v) => unEscapeValue(v) === recValue);
  },
  [operators.isNull]: (recValue) => recValue === null || recValue === undefined,
  [operators.notNull]: (recValue) => recValue !== null && recValue !== undefined,
  [operators.isEmpty]: (recValue) => isEmpty(recValue),
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
    const parts = fieldName.split('.');
    const field = parts.pop();
    Object.assign(column, { relationships: parts, field });
  }
  return column;
};

const getValue = (record, { relationships, field }, schema, modelName) => {
  if (relationships?.length) {
    const terminalRecord = relationships
      .reduce(
        ({ modelName, models }, relationship) => {
          if (modelName) {
            const { modelName: relationshipModelName, foreignKey } = schema.associationsFor(modelName)[relationship];
            const foreignKeyValues = models.map((r) => r[foreignKey]).filter(isPresent);
            return foreignKeyValues.length ? schema.find(relationshipModelName, foreignKeyValues) : [];
          } else {
            return [];
          }
        },
        { modelName, models: [record] }
      )
      .filter((r) => r);
    return terminalRecord?.models?.map((rec) => rec[field]);
  } else {
    return record[field];
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
