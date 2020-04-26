/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'covid-19-dashboard/config/environment';
import { task, hash } from 'ember-concurrency';
import { buildWaiter } from 'ember-test-waiters';

const { tileServer, tileServerAttribution } = ENV.APP;

const ZOOM_LEVELS = {
  global: 3,
  countries: 4,
  states: 7,
  counties: 9,
};

const MOBILE_ZOOM_LEVELS = {
  global: 1,
  countries: 3,
  states: 7,
  counties: 8,
};

const REQUEST_FIELDS = [
  'id',
  'label',
  'wikiId',
  'latitude',
  'longitude',
  'numActiveCases',
  'totalConfirmedCases',
  'totalDeaths',
  'totalRecoveredCases',
];

const waiter = buildWaiter('map-zoom-waiter');

export default class MapComponent extends Component {
  @service elide;
  @service screen;
  @tracked countyRecords = [];
  @tracked countryRecords = [];
  @tracked stateRecords = [];
  @tracked zoom = ZOOM_LEVELS.global;
  @tracked currentZoom = ZOOM_LEVELS.global;

  tileServerAttribution = tileServerAttribution;
  tileUrl = tileServer;

  get centerLocation() {
    const { location } = this.args;
    if (!location) return null;

    if (location.type === 'global') {
      return [40, 0];
    }
    return [location.attributes.latitude, location.attributes.longitude];
  }

  get showMarker() {
    const { location } = this.args;
    if (!location) return false;

    if (location.type === 'global') {
      return false;
    }
    return true;
  }

  get focusedState() {
    const { location } = this.args;
    let state = null;
    if (location?.type === 'states') {
      state = location;
    } else if (location?.type === 'counties') {
      state = location.state;
    }
    return state;
  }

  @action
  fetchCountyRecords() {
    const {
      args: { location, publishedDate },
    } = this;
    this.countyRecords = [];
    if (location && publishedDate) {
      this.fetchCountyData.perform(location);
    }
  }

  @task(function* (location) {
    if (['states', 'counties'].includes(location.type)) {
      const data = yield this.elide.fetch.perform('latestHealthRecords', {
        fields: {
          latestHealthRecords: [...REQUEST_FIELDS, 'state'],
        },
        eq: {
          'state.id': location.state?.id || location.id,
        },
        notNull: ['county'],
        include: ['state'],
      }) || {};
      if (data.data) {
        this.countyRecords = data.data.filter((r) => r.attributes[this.args.fieldToShow]);
      }
    } else {
      this.countyRecords = [];
    }
  })
  fetchCountyData;

  @action
  fetchGlobalRecords() {
    if (this.args.publishedDate) {
      this.fetchGlobalData.perform();
    }
  }

  @task(function* () {
    const states =
      this.elide.fetch.perform('latestHealthRecords', {
        fields: {
          latestHealthRecords: [...REQUEST_FIELDS, 'country'],
        },
        isNull: ['county'],
        notNull: ['state'],
      }) || {};

    const countries =
      this.elide.fetch.perform('latestHealthRecords', {
        fields: {
          latestHealthRecords: [REQUEST_FIELDS, 'country'],
        },
        isNull: ['county', 'state'],
        notNull: ['country'],
      }) || {};

    const { states: stateRecords, countries: countryRecords } = yield hash({ states, countries });

    if (stateRecords.data) {
      this.stateRecords = stateRecords.data.filter((r) => r.attributes[this.args.fieldToShow]);
    }

    const countryHasStates = this.stateRecords.reduce((acc, state) => {
      const country = state.relationships.country.data.id;
      acc[country] = true;
      return acc;
    }, {});

    if (countryRecords.data) {
      this.countryRecords = countryRecords.data
        .filter((r) => r.attributes[this.args.fieldToShow])
        .filter((r) => !countryHasStates[r.relationships.country.data.id]);
    }
  })
  fetchGlobalData;

  @action
  zoomStart() {
    this.waitToken = waiter.beginAsync();
  }

  @action
  zoomEnd({ target }) {
    this.currentZoom = target.getZoom();
    waiter.endAsync(this.waitToken);
  }

  @action
  setZoom() {
    const { isMobile } = this.screen;
    const { location } = this.args;
    const levels = isMobile ? MOBILE_ZOOM_LEVELS : ZOOM_LEVELS;
    let zoom = levels.global;
    if (location) {
      zoom = levels[location.type];
    }
    this.zoom = zoom;
  }
}
