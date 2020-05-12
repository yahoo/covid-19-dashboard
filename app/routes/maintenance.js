/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Route from '@ember/routing/route';
import ENV from '../config/environment';

export default class MaintenanceRoute extends Route {
  beforeModel() {
    if (ENV.APP.maintenanceMode !== true) {
      this.transitionTo('dashboard');
    }
  }
}
