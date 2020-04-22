/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service metrics;
  @service router;
  @service intl;
  @service metadata;

  constructor() {
    super(...arguments);
    const { metrics, router } = this;

    router.on('routeDidChange', () => {
      const page = router.currentURL;
      const title = router.currentRouteName || 'unknown';
      metrics.trackPage({ page, title });
    });
  }

  beforeModel() {
    super.beforeModel(...arguments);
    return this.intl.setLocale(['en-us']);
  }

  model() {
    this.metadata.fetch();
  }
}
