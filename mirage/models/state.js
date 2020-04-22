import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  country: belongsTo(),
  counties: hasMany(),
});
