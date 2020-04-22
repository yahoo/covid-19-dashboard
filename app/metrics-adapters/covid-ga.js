/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import BaseAdapter from 'ember-metrics/metrics-adapters/google-analytics';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'covid-ga';
  },

  trackException(options = {}) {
    window.ga('send', 'exception', options);
  },
});
