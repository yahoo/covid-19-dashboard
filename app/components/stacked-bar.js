/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import numeral from 'numeral';

const METRICS = {
  numPositiveTests: 'confirmed',
  numDeaths: 'fatal',
  numRecoveredCases: 'recovered',
};

export default class StackedBarComponent extends Component {
  @service intl;

  get chartOptions() {
    const { intl } = this;
    return {
      chart: {
        animations: {
          enabled: false,
        },
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        width: '100%',
      },
      colors: ['#19c6f4', '#fed800', '#87d812'],
      grid: {
        padding: {
          left: 0,
          right: 0,
        },
      },
      legend: {
        formatter: function (seriesName) {
          return intl.t(seriesName);
        },
        markers: {
          width: 8,
          height: 8,
        },
        offsetX: 20,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          title: {
            formatter: (seriesName) => intl.t(seriesName),
          },
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            fontSize: '10px',
          },
          offsetY: -5,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => numeral(val).format('0.0a'),
          style: {
            fontSize: '10px',
          },
          offsetX: 20,
          offsetY: -5,
        },
        tickAmount: 3,
      },
    };
  }

  get series() {
    const { records } = this.args;
    if (!records) return [];
    return this.convertToSeries(records);
  }

  convertToSeries(records) {
    const chartSeriesData = [];
    const data = records.data.map((r) => r.attributes);

    Object.keys(METRICS).forEach((metric) => {
      const seriesObj = this.getSeriesForMetric(data, metric);
      chartSeriesData.push({
        name: METRICS[metric],
        data: seriesObj,
      });
    });

    return chartSeriesData;
  }

  getSeriesForMetric(data, metric) {
    const results = [];
    data.forEach((row) => {
      const seriesObj = {};
      seriesObj.x = new Date(row.referenceDate).getTime();
      const cases = row[metric];
      seriesObj.y = cases;
      results.push(seriesObj);
    });

    return results;
  }
}
