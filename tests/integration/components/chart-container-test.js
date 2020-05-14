import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chart-container', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(4);

    await render(hbs`
      <ChartContainer @location={{hash attributes=(hash wikiId="Earth")}} />
    `);

    assert.dom('.chart-container')
      .exists('A chart container is rendered');

    assert.dom('.chart-container .chart-container__timeseries')
      .exists('A timeseries is rendered in the chart container');
    assert.dom('.chart-container__timeseries .timeseries__title')
      .hasText('Cases over time', 'the timeseries chart renders with a title');
    assert.dom('.chart-container .chart-container__timeseries .ember-apex-chart')
      .exists('A timeseries chart is also rendered in the chart container');
  });
});
