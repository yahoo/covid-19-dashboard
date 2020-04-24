/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DashboardLocationRoute extends Route {
  @service location;
  @service intl;

  model({ location_id }) {
    return location_id;
  }

  updateTitle({ attributes: { label } }) {
    document.title = this.intl.t('pageTitle', { label });
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.fetchLocation(model).then((location) => {
      if (location) {
        this.updateTitle(location);
      } else {
        this.transitionTo('dashboard');
      }
    });
  }
}
