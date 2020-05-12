/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default class ApplicationRoute extends Route {
  @service metrics;
  @service router;
  @service intl;
  @service metadata;

  constructor() {
    super(...arguments);
    const { metrics, router } = this;

    router.on('routeDidChange', () => {
      this.maintenanceModeIntercept();
      const page = router.currentURL;
      const title = router.currentRouteName || 'unknown';
      metrics.trackPage({ page, title });
    });
  }

  maintenanceModeIntercept() {
    if (ENV.environment !== 'test' && ENV.APP.maintenanceMode === true) {
      this.transitionTo('maintenance');
    }
  }

  beforeModel() {
    super.beforeModel(...arguments);
    this.intl.setLocale(['en-us']);
    this.maintenanceModeIntercept();
  }

  model() {
    this.metadata.fetch();
  }
}
