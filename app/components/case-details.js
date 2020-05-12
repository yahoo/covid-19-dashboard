/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { GLOBAL_ID } from '../services/location';

export default class CaseDetailsComponent extends Component {
  @service elide;
  @tracked summaryRecord;
  @tracked loading = true;
  @tracked dailyActiveCasesDiff;
  @tracked totalConfirmedCasesDiff;
  @tracked totalConfirmedCasesDiffPercent;

  get isGlobal() {
    return this.args.location?.id === GLOBAL_ID;
  }

  get series() {
    if (this.loading || !this.summaryRecord) {
      return [];
    }
    const { totalDeaths = 0, totalRecoveredCases = 0, totalConfirmedCases = 0 } = this.summaryRecord;
    const unknown = totalConfirmedCases - (totalDeaths + totalRecoveredCases);
    return [
      { name: 'Fatal', data: [totalDeaths] },
      { name: 'Recovered', data: [totalRecoveredCases] },
      { name: 'Unknown', data: [unknown] },
    ];
  }

  @action
  fetchData() {
    const { location, publishedDate } = this.args;
    if (location && publishedDate) {
      this.fetchDataTask.perform(location);
    }
  }

  @(task(function* (location) {
    this.loading = true;
    const { data: healthRecord } = yield this.elide.fetch.perform('latestHealthRecords', {
      eq: { 'place.id': location.id },
      fields: {
        latestHealthRecords: [
          'totalConfirmedCases',
          'totalDeaths',
          'totalRecoveredCases',
          'dataSource',
          'referenceDate',
        ],
      },
      limit: 1,
    });
    this.summaryRecord = healthRecord[0]?.attributes;
    this.loading = false;
  }).restartable())
  fetchDataTask;
}
