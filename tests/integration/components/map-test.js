import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    this.set('location', { attributes: { latitude: 0, longitude: 0 } });
    await render(hbs`<Map @location={{this.location}}/>`);
    assert.dom('.map').exists('Map component can render');
  });
});
