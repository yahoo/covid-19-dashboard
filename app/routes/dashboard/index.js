/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */

import Route from '@ember/routing/route';
import { GLOBAL_ID } from '../../services/location';

export default class DashboardIndexRoute extends Route {
  redirect() {
    this.replaceWith('dashboard.location', GLOBAL_ID);
  }
}
