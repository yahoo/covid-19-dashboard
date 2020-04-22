import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | neq', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{neq 1 2}}`);
    assert.dom().hasText('true', 'neq return true when to numbers are not the same');

    await render(hbs`{{neq "1" "1"}}`);
    assert.dom().hasText('false', 'neq return false when to numbers are the same');
  });
});
