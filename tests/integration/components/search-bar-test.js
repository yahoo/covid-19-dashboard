import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | search-bar', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('search bar rendered', async function (assert) {
    assert.expect(4);

    await render(hbs`<SearchBar />`);
    assert.dom('.search-bar__trigger').exists('A search input is rendered');

    await click('.search-bar__trigger');

    await fillIn('.search-bar__trigger-input', 'cha');
    assert
      .dom('.search-bar .ember-power-select-option--loading-message')
      .exists('While data loads a loading message is rendered');

    await waitFor('.search-bar .ember-power-select-option');
    assert.dom('.search-bar .ember-power-select-option').exists({ count: 3 }, 'Three items are rendered');

    await fillIn('.search-bar__trigger-input', 'states');
    await waitFor('.search-bar .ember-power-select-option');
    assert.dom('.search-bar .ember-power-select-option').hasText('United States', 'Search also looks for countries');
  });
});
