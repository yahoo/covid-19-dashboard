import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | get-radius', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('inputValue', '1234');

    this.set('zoom', 1);
    await render(hbs`{{get-radius number=100 zoom=this.zoom}}`);
    assert.dom().hasText('20000', 'get-radius can calculate the radius with a zoom value');

    this.set('zoom', 7);
    await render(hbs`{{get-radius number=100 zoom=this.zoom}}`);
    assert.dom().hasText('10000', 'get-radius can calculate the radius with a zoom value');
  });
});
