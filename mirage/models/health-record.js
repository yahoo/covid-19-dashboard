import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  county: belongsTo(),
  state: belongsTo(),
  country: belongsTo(),
});
