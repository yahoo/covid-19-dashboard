/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { GLOBAL_ID } from '../../services/location';

export default class DashboardLocationController extends Controller {
  @service elide;
  @service location;
  @service metadata;
  @service screen;
  @service router;

  @tracked currentLocation;
  @tracked locationLineage;
  @tracked mobileView = 'details';

  globalId = GLOBAL_ID;

  get showLocationCaseDetails() {
    const { screen, currentLocation } = this;
    return screen.isMobile || currentLocation?.id !== GLOBAL_ID;
  }

  @action
  onLocationSelect(location) {
    this.router.transitionTo('dashboard.location', location);
    this.mobileView = 'details';
  }

  @(task(function* (id) {
    const lineage = yield this.location.fetchLineageTask.perform(id);
    this.locationLineage = lineage;
  }).restartable())
  fetchLocationLineageTask;

  @(task(function* (id) {
    const location = yield this.location.fetchTask.perform(id);
    if (location) {
      this.fetchLocationLineageTask.perform(location.id);
    }
    return (this.currentLocation = location);
  }).restartable())
  fetchLocationTask;

  fetchLocation(id) {
    return this.fetchLocationTask.perform(id);
  }
}
