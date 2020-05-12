/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE.md file for terms.
 */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class LocationTableComponent extends Component {
  @service elide;
  @tracked locations;
  @tracked loading = true;

  get locationParentId() {
    const { location } = this.args;
    return location?.relationships.parents.data?.[0]?.id;
  }

  @action
  fetchData() {
    const {
      fetchDataTask,
      args: { fieldToShow, location, publishedDate },
    } = this;
    if (location && fieldToShow && publishedDate) {
      fetchDataTask.perform(location, fieldToShow);
    }
  }

  @(task(function* ({ id }, fieldToShow) {
    this.loading = true;
    let { data: healthRecords = [] } = yield this.elide.fetch.perform('latestHealthRecords', {
      fields: {
        latestHealthRecords: [fieldToShow, 'label', 'place'],
      },
      eq: {
        'place.parents.id': id,
      },
      sort: `-${fieldToShow}`,
    });
    this.locations = healthRecords;
    this.loading = false;
  }).restartable())
  fetchDataTask;
}
