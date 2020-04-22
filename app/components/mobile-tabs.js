/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE.md file for terms.
 */
import Component from '@glimmer/component';
import { breakdownLocationType } from '../utils/location';

export default class MobileTabsComponent extends Component {
  get breakdownLocationType() {
    const { location } = this.args;
    return breakdownLocationType(location);
  }
}
