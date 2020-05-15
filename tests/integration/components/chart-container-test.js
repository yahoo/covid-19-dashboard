import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chart-container', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(7);

    await render(hbs`
      <ChartContainer @location={{hash attributes=(hash wikiId="Earth")}} />
    `);

    assert.dom('.chart-container').exists('A chart container is rendered');

    assert
      .dom('.chart-container .chart-container__timeseries')
      .exists('A timeseries is rendered in the chart container');
    assert
      .dom('.chart-container__timeseries .timeseries__title')
      .hasText('Cases Over Time', 'the timeseries chart renders with a title');
    assert
      .dom('.chart-container .chart-container__timeseries .ember-apex-chart')
      .exists('A timeseries chart is also rendered in the chart container');

    assert
      .dom('.chart-container .chart-container__stacked-bar')
      .exists('A stacked bar is rendered in the chart container');
    assert
      .dom('.chart-container__stacked-bar .stacked-bar__title')
      .hasText('Daily Change', 'the stacked bar chart renders with a title');
    assert
      .dom('.chart-container .chart-container__stacked-bar .ember-apex-chart')
      .exists('A stacked bar chart is also rendered in the chart container');
  });
});
