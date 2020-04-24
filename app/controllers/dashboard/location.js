/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class DashboardLocationController extends Controller {
  @service elide;
  @service location;
  @service metadata;
  @service screen;
  @service router;

  @tracked currentLocation;
  @tracked mobileView = 'details';

  get showLocationCaseDetails() {
    const { screen, currentLocation } = this;
    return screen.isMobile || (currentLocation?.type && currentLocation.type !== 'global');
  }

  @action
  onLocationSelect(location) {
    this.router.transitionTo('dashboard.location', location);
    this.mobileView = 'details';
  }

  @(task(function* (wikiId) {
    const currentLocation = yield this.location.fetch(wikiId);
    return (this.currentLocation = currentLocation);
  }).restartable())
  fetchLocationTask;

  fetchLocation(wikiId) {
    return this.fetchLocationTask.perform(wikiId);
  }
}
