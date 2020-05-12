/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class SearchBarComponent extends Component {
  @service elide;
  @service router;
  @service search;

  @(task(function* (value) {
    if (value?.length < 2) {
      return;
    }

    yield timeout(200);

    const places = yield this.elide.fetch.perform('places', {
      search: { label: [value] },
      fields: {
        places: ['id', 'label'],
      },
      limit: 100,
    });
    const results = places?.data?.map(({ id, attributes: { label } }) => ({
      id,
      label,
    }));
    return this.search.searchRecords(results, value, 'label');
  }).restartable())
  searchLocation;

  @action
  handleSelect(location) {
    scheduleOnce('actions', this.select.actions, 'search', '');
    this.args.onLocationSelect(location.id);
  }

  @action
  handleRegister(select) {
    this.select = select;
  }
}
