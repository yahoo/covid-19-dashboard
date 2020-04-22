/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';

export default class DistributionChartComponent extends Component {
  get options() {
    const { labels } = this.args;

    const options = {
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%',
        },
      },
      colors: ['#19c6f4', '#fed800', '#87d812', '#f2f2f2'],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
        max: this.args.series.reduce((acc, { data }) => acc + data, 0),
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      tooltip: {
        enabled: false,
      },
    };

    if (labels) {
      options.xaxis.categories = labels;
    } else {
      options.yaxis = { show: false };
    }

    return options;
  }
}
