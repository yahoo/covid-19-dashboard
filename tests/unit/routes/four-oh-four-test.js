import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | four-oh-four', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:four-oh-four');
    assert.ok(route);
  });
});
