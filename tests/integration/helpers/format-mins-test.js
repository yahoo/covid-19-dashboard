import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format-mins', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(3);
    this.set('inputValue', '34');

    await render(hbs`{{format-mins inputValue}}`);
    assert.dom().hasText('34 mins');

    this.set('inputValue', '834');
    assert.dom().hasText('13h 54m');

    this.set('inputValue', '67834');
    assert.dom().hasText('47d 2h 34m');
  });

  test('it can handle empty values', async function (assert) {
    this.set('inputValue', undefined);
    await render(hbs`{{format-mins inputValue}}`);
    assert.dom().hasText('--', 'format helper renders `--` when given undefined');

    this.set('inputValue', null);
    await render(hbs`{{format-mins inputValue}}`);
    assert.dom().hasText('--', 'format helper renders `--` when given null');
  });
});
