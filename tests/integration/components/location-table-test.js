import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import setupRouting from '../../helpers/setup-router';

module('Integration | Component | location-table', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupRouting(hooks);

  test('it renders', async function (assert) {
    const location = await this.owner.lookup('service:location').fetchTask.perform('Earth');
    this.set('location', location);
    this.set('date', '2020-04-03T00:00Z');
    this.set('fieldToShow', 'totalConfirmedCases');
    await render(
      hbs`<LocationTable @location={{this.location}} @publishedDate={{this.date}} @fieldToShow={{this.fieldToShow}} />`
    );

    await waitFor('.location-table__list-item');
    assert.dom('.location-table__list').exists('The list is rendered');
    assert.dom('.location-table__list-item').exists('The list is populated');
    assert.dom('.location-table__list-item').hasText('United States 1,069,826', 'The list item fields are populated');
  });
});
