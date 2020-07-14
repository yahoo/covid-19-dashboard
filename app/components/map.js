/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'covid-19-dashboard/config/environment';
import { task, all } from 'ember-concurrency';
import { buildWaiter } from 'ember-test-waiters';
import {
  GLOBAL_ID,
  ASTRONOMICAL_OBJECT_TYPE,
  COUNTRY_TYPE,
  STATE_ADMIN_AREA_TYPE,
  COUNTY_ADMIN_AREA_TYPE,
} from '../services/location';

const { tileServer, tileServerAttribution } = ENV.APP;

const ZOOM_LEVELS = {
  [ASTRONOMICAL_OBJECT_TYPE]: 3,
  [COUNTRY_TYPE]: 4,
  [STATE_ADMIN_AREA_TYPE]: 7,
  [COUNTY_ADMIN_AREA_TYPE]: 9,
};

const MOBILE_ZOOM_LEVELS = {
  [ASTRONOMICAL_OBJECT_TYPE]: 1,
  [COUNTRY_TYPE]: 3,
  [STATE_ADMIN_AREA_TYPE]: 7,
  [COUNTY_ADMIN_AREA_TYPE]: 8,
};

const MAX_ZOOM = 10;

const REQUEST_FIELDS = [
  'id',
  'label',
  'latitude',
  'longitude',
  'totalConfirmedCases',
  'totalDeaths',
  'totalRecoveredCases',
  'place',
];

const waiter = buildWaiter('map-zoom-waiter');

export default class MapComponent extends Component {
  @service elide;
  @service screen;
  @tracked locationRecords = [];
  @tracked countryRecords = [];
  @tracked stateAdminAreaRecords = [];
  @tracked zoom = ZOOM_LEVELS[ASTRONOMICAL_OBJECT_TYPE];
  @tracked currentZoom = ZOOM_LEVELS[ASTRONOMICAL_OBJECT_TYPE];

  tileServerAttribution = tileServerAttribution;
  tileUrl = tileServer;

  maxZoom = MAX_ZOOM;

  get centerLocation() {
    const { location } = this.args;
    if (!location) return null;

    if (location.id === GLOBAL_ID) {
      return [40, 0];
    }
    return [location.attributes.latitude, location.attributes.longitude];
  }

  get showMarker() {
    const { location } = this.args;
    return location?.id !== GLOBAL_ID;
  }

  get locationParentId() {
    const { location } = this.args;
    return location?.relationships.parents.data?.[0]?.id;
  }

  get locationPlaceType() {
    const { location } = this.args;
    return location?.attributes.placeType.split(',')[0];
  }

  get fetchLocationRecordsFilter() {
    const { locationPlaceType } = this;
    const { location } = this.args;
    switch (locationPlaceType) {
      case STATE_ADMIN_AREA_TYPE:
        return { eq: { 'place.parents.id': location.id } };
      case COUNTY_ADMIN_AREA_TYPE:
        return { eq: { 'place.parents.id': this.locationParentId } };
      default:
        return { eq: { 'place.id': location.id } };
    }
  }

  @computed('args.locationLineage')
  get locationLineageIds() {
    const { locationLineage } = this.args;
    return locationLineage?.map(({ id }) => id) || [];
  }

  @action
  fetchLocationRecords() {
    const {
      args: { location, publishedDate },
    } = this;
    this.locationRecords = [];
    if (location && publishedDate) {
      this.fetchLocationRecordsTask.perform();
    }
  }

  @task(function* () {
    const { locationPlaceType } = this;
    if (![ASTRONOMICAL_OBJECT_TYPE, COUNTRY_TYPE].includes(locationPlaceType)) {
      const latestHealthRecords = yield this.elide.fetch.perform('latestHealthRecords', {
        fields: {
          latestHealthRecords: REQUEST_FIELDS,
        },
        ...this.fetchLocationRecordsFilter,
      }) || {};
      if (latestHealthRecords.data) {
        this.locationRecords = latestHealthRecords.data.filter((r) => r.attributes[this.args.fieldToShow]);
      }
    }
  })
  fetchLocationRecordsTask;

  @action
  fetchGlobalRecords() {
    if (this.args.publishedDate) {
      this.fetchGlobalRecordsTask.perform();
    }
  }

  @task(function* () {
    const countriesPromise =
      this.elide.fetch.perform('latestHealthRecords', {
        fields: {
          latestHealthRecords: REQUEST_FIELDS,
        },
        eq: {
          'place.parents.id': GLOBAL_ID,
        },
        include: ['place'],
      }) || {};

    const stateAdminAreasPromise =
      this.elide.fetch.perform('latestHealthRecords', {
        fields: {
          latestHealthRecords: REQUEST_FIELDS,
          places: ['id', 'parents'],
        },
        eq: {
          'place.parents.parents.id': GLOBAL_ID,
        },
        include: ['place'],
      }) || {};

    const [stateAdminAreaRecords, countryRecords] = yield all([stateAdminAreasPromise, countriesPromise]);

    if (stateAdminAreaRecords.data) {
      this.stateAdminAreaRecords = stateAdminAreaRecords.data.filter((r) => r.attributes[this.args.fieldToShow]);
    }

    const countryHasSub = stateAdminAreaRecords.included.reduce((acc, region) => {
      const parents = region.relationships.parents.data;
      parents.forEach(({ id }) => {
        acc[id] = true;
      });
      return acc;
    }, {});

    if (countryRecords.data) {
      this.countryRecords = countryRecords.data
        .filter((r) => r.attributes[this.args.fieldToShow])
        .filter((r) => !countryHasSub[r.relationships.place.data.id]);
    }
  })
  fetchGlobalRecordsTask;

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
    const { locationPlaceType, maxZoom } = this;
    const levels = isMobile ? MOBILE_ZOOM_LEVELS : ZOOM_LEVELS;
    let zoom = levels[ASTRONOMICAL_OBJECT_TYPE];
    if (location) {
      zoom = levels[locationPlaceType] || maxZoom;
    }
    this.zoom = zoom;
  }
}
