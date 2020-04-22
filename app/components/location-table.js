/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE.md file for terms.
 */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { pluralize } from '../utils/inflector';
import { breakdownLocationType } from '../utils/location';

const locationFilters = {
  countries: () => {
    return {
      notNull: ['country'],
      isNull: ['county', 'state'],
    };
  },
  states: ({ attributes: { wikiId } }) => {
    return {
      eq: { 'country.wikiId': wikiId },
      notNull: ['state'],
      isNull: ['county'],
    };
  },
  counties: ({ attributes: { wikiId } }) => {
    return {
      eq: { 'state.wikiId': wikiId },
      notNull: ['county'],
    };
  },
};

export default class LocationTableComponent extends Component {
  @service elide;
  @tracked locations;
  @tracked loading = true;

  get title() {
    const { breakdownLocationType } = this;
    if (breakdownLocationType) {
      return `casesBy.${breakdownLocationType}`;
    }
    return 'empty';
  }

  get breakdownLocation() {
    const {
      breakdownLocationType,
      args: { location },
    } = this;
    if (!location || !breakdownLocationType) return undefined;
    switch (breakdownLocationType) {
      case 'county':
        return location.state || location;
      case 'state':
        return location.country || location;
      default:
        return undefined;
    }
  }

  get breakdownLocationType() {
    const { location } = this.args;
    return breakdownLocationType(location);
  }

  get parentLocationId() {
    const { location } = this.args;
    const { breakdownLocationType } = this;

    if (breakdownLocationType === 'country') {
      return undefined;
    } else if (breakdownLocationType === 'state') {
      return 'Earth';
    } else if (breakdownLocationType === 'county' && location?.country) {
      return location.country.attributes.wikiId;
    }

    return undefined;
  }

  get selectedLocationId() {
    return this.args.location.attributes.wikiId;
  }

  @action
  fetchData() {
    const {
      fetchDataTask,
      breakdownLocationType,
      breakdownLocation,
      args: { fieldToShow, publishedDate },
    } = this;
    if (breakdownLocationType && fieldToShow && publishedDate) {
      fetchDataTask.perform(breakdownLocation, breakdownLocationType, fieldToShow);
    }
  }

  @(task(function* (location, breakdownLocationType, fieldToShow) {
    this.loading = true;
    const req = {
      fields: {
        latestHealthRecords: [fieldToShow, 'label', 'wikiId'],
      },
      ...locationFilters[pluralize(breakdownLocationType)](location),
      sort: `-${fieldToShow}`,
    };
    const { data: healthRecords = [] } = yield this.elide.fetch.perform('latestHealthRecords', req);

    this.locations = healthRecords;

    this.loading = false;
  }).restartable())
  fetchDataTask;
}
