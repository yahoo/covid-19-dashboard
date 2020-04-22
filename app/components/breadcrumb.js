/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';

export default class BreadcrumbComponent extends Component {
  get locations() {
    const { location } = this.args;

    switch (location?.type) {
      case 'counties':
        return [location.country, location.state, location];
      case 'states':
        return [location.country, location];
      case 'countries':
        return [location];
      default:
        return [];
    }
  }
}
