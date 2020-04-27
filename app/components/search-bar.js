/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, all, timeout } from 'ember-concurrency';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class SearchBarComponent extends Component {
  @service elide;
  @service router;
  @tracked locations;
  @tracked loading;

  normalizeRecords(rows) {
    return rows.map((row) => ({
      id: row.id,
      label: row.attributes.label,
      wikiId: row.attributes.wikiId,
    }));
  }

  @(task(function* (value) {
    if (value?.length < 2) {
      this.loading = false;
      this.locations = [];
      return;
    }

    const { normalizeRecords } = this;
    yield timeout(50);
    const countiesReq = this.elide.fetch.perform('counties', {
      search: { label: [value] },
      fields: {
        counties: ['id', 'label', 'wikiId'],
      },
      limit: 100,
    });
    const statesReq = this.elide.fetch.perform('states', {
      search: { label: [value] },
      fields: {
        states: ['id', 'label', 'wikiId'],
      },
      limit: 100,
    });
    const countriesReq = this.elide.fetch.perform('countries', {
      search: { label: [value] },
      fields: {
        countries: ['id', 'label', 'wikiId'],
      },
      limit: 100,
    });

    const requests = yield all([countriesReq, statesReq, countiesReq]);
    const records = requests.map(({ data }) => normalizeRecords(data));

    return [...records[0], ...records[1], ...records[2]];
  }).restartable())
  searchLocation;

  @action
  handleSelect(location) {
    scheduleOnce('actions', this.select.actions, 'search', '');
    this.args.onLocationSelect(location.wikiId);
  }

  @action
  handleRegister(select) {
    this.select = select;
  }
}
