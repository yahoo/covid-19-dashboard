/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { all, task } from 'ember-concurrency';

export const GLOBAL_ID = 'Earth';

export default class LocationService extends Service {
  @service elide;

  @task(function* (wikiId) {
    const counties = this.elide.fetch.perform('counties', {
      eq: { wikiId },
      fields: {
        counties: ['id', 'label', 'latitude', 'longitude', 'population', 'wikiId'],
        states: ['id', 'label', 'wikiId'],
        countries: ['id', 'label', 'wikiId'],
      },
      include: ['state', 'state.country'],
    });
    const states = this.elide.fetch.perform('states', {
      eq: { wikiId },
      fields: {
        states: ['id', 'label', 'latitude', 'longitude', 'population', 'wikiId', 'counties'],
        countries: ['id', 'label', 'wikiId'],
      },
      include: ['country'],
    });
    const countries = this.elide.fetch.perform('countries', {
      eq: { wikiId },
      fields: { countries: ['id', 'label', 'latitude', 'longitude', 'population', 'wikiId', 'states'] },
    });

    const locations = yield all([counties, states, countries]);
    const location = locations.find((loc) => loc.data?.length);
    if (location) {
      const [selectedLocation] = location.data;
      const country = location.included?.find((rel) => rel.type === 'countries');
      const state = location.included?.find((rel) => rel.type === 'states');
      const type = selectedLocation.attributes.wikiId === GLOBAL_ID ? 'global' : selectedLocation.type;
      return {
        ...selectedLocation,
        country,
        state,
        type,
      };
    } else {
      return undefined;
    }
  })
  fetchTask;

  fetch(wikiId) {
    return this.fetchTask.perform(wikiId);
  }
}
