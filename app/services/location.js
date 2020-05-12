/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export const GLOBAL_ID = 'Earth';

export const SUPERNAME_TYPE = 'Supername';
export const COUNTRY_TYPE = 'Country';
export const STATE_ADMIN_AREA_TYPE = 'StateAdminArea';
export const COUNTY_ADMIN_AREA_TYPE = 'CountyAdminArea';

export default class LocationService extends Service {
  @service elide;

  @task(function* (id) {
    const place = yield this.elide.fetch.perform('places', {
      eq: { id },
      fields: {
        places: ['id', 'label', 'latitude', 'longitude', 'population', 'wikiId', 'placeType', 'parents'],
      },
    });

    return place?.data?.[0];
  })
  fetchTask;

  @task(function* (id) {
    const locations = [];
    while (id) {
      const place = (yield this.elide.fetch.perform('places', {
        eq: { id },
        fields: {
          places: ['id', 'label', 'placeType', 'parents'],
        },
      }))?.data?.[0];
      if (place.id !== GLOBAL_ID) {
        locations.unshift(place);
      }
      id = place?.relationships.parents.data?.[0]?.id;
    }
    return locations;
  })
  fetchLineageTask;
}
