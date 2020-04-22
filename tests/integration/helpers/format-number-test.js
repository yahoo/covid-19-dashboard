import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format-number', function (hooks) {
  setupRenderingTest(hooks);

  test('it formats a number', async function (assert) {
    this.set('inputValue', '1234');
    await render(hbs`{{format-number inputValue}}`);
    assert.dom().hasText('1,234');
  });

  test('it can handle empty values', async function (assert) {
    this.set('inputValue', undefined);
    await render(hbs`{{format-number inputValue}}`);
    assert.dom().hasText('--', 'format helper renders `--` when given undefined');

    this.set('inputValue', null);
    await render(hbs`{{format-number inputValue}}`);
    assert.dom().hasText('--', 'format helper renders `--` when given null');
  });
});
