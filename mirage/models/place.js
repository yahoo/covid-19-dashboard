import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  children: hasMany('place'),
  parents: hasMany('place'),
});
