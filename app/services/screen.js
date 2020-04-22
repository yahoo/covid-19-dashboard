/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ScreenService extends Service {
  @tracked isMobile;

  constructor() {
    super(...arguments);
    const query = window.matchMedia('(max-width: 900px)');
    this.isMobile = query.matches;
    query.addListener((e) => (this.isMobile = e.matches));
  }
}
