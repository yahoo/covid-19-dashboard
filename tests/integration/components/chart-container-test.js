import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | chart-container', function (hooks) {
  setupRenderingTest(hooks);

  test('cases over time', async function (assert) {
    assert.expect(3);

    await render(hbs`<ChartContainer @location={{hash attributes=(hash wikiId="Earth")}} />`);

    assert
      .dom('.chart-container .chart-container__graph--time-series')
      .exists('A timeseries is rendered in the chart container');
    assert
      .dom('.chart-container__graph--time-series .timeseries__title')
      .hasText('Cases Over Time', 'the timeseries chart renders with a title');
    assert
      .dom('.chart-container .chart-container__graph--time-series .ember-apex-chart')
      .exists('A timeseries chart is also rendered in the chart container');
  });

  test('7-day moving average', async function (assert) {
    assert.expect(3);

    await render(hbs`<ChartContainer @location={{hash attributes=(hash wikiId="Earth")}} />`);

    assert
      .dom(findAll('.chart-container .chart-container__graph--time-series')[1])
      .exists('A second timeseries is rendered in the chart container');
    assert
      .dom(findAll('.chart-container__graph--time-series .timeseries__title')[1])
      .hasText('7-Day Moving Average', 'the second timeseries chart renders with a title');
    assert
      .dom(findAll('.chart-container .chart-container__graph--time-series .ember-apex-chart')[1])
      .exists('A second timeseries chart is also rendered in the chart container');
  });

  test('daily change', async function (assert) {
    assert.expect(3);

    await render(hbs`<ChartContainer @location={{hash attributes=(hash wikiId="Earth")}} />`);

    assert
      .dom('.chart-container .chart-container__graph--stacked-bar')
      .exists('A stacked bar is rendered in the chart container');
    assert
      .dom('.chart-container__graph--stacked-bar .stacked-bar__title')
      .hasText('Daily Change', 'the stacked bar chart renders with a title');
    assert
      .dom('.chart-container .chart-container__graph--stacked-bar .ember-apex-chart')
      .exists('A stacked bar chart is also rendered in the chart container');
  });
});
