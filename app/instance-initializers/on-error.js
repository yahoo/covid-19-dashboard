/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Ember from 'ember';

export function initialize(appInstance) {
  const metrics = appInstance.lookup('service:metrics');
  Ember.onerror = function (error) {
    metrics.invoke('trackException', { exDescription: error.message });
  };
}

export default {
  initialize,
};
