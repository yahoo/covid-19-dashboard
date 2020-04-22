/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { GLOBAL_ID } from 'covid-19-dashboard/services/location';

export default class CaseDetailsComponent extends Component {
  @service elide;
  @tracked summaryRecord;
  @tracked loading = true;
  @tracked dailyActiveCasesDiff;
  @tracked totalConfirmedCasesDiff;
  @tracked totalConfirmedCasesDiffPercent;

  get isGlobal() {
    return this.args.location?.attributes.wikiId === GLOBAL_ID;
  }

  get series() {
    if (this.loading || !this.summaryRecord) {
      return [];
    }
    const {
      numActiveCases = 0,
      totalDeaths = 0,
      totalRecoveredCases = 0,
      totalConfirmedCases = 0,
    } = this.summaryRecord;
    const unknown = totalConfirmedCases - (numActiveCases + totalDeaths + totalRecoveredCases);
    return [
      { name: 'Active', data: [numActiveCases] },
      { name: 'Fatal', data: [totalDeaths] },
      { name: 'Recovered', data: [totalRecoveredCases] },
      { name: 'Unknown', data: [unknown] },
    ];
  }

  @action
  fetchData() {
    const { location, publishedDate } = this.args;
    if (location && publishedDate) {
      this.fetchSummaryRecord.perform(location);
    }
  }

  @(task(function* (location) {
    this.loading = true;
    const { data: todayHealthRecords } = yield this.elide.fetch.perform('latestHealthRecords', {
      eq: { wikiId: location.attributes.wikiId },
      fields: {
        latestHealthRecords: [
          'totalConfirmedCases',
          'numActiveCases',
          'totalDeaths',
          'numDeaths',
          'totalRecoveredCases',
          'numRecoveredCases',
          'dataSource',
          'referenceDate',
        ],
      },
      limit: 1,
    });
    const todayRecord = todayHealthRecords[0]?.attributes;
    this.summaryRecord = todayRecord;

    const yesterday = new Date(this.summaryRecord.referenceDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.toISOString().slice(0, 16)}Z`;

    const { data: yesterdayHealthRecords } = yield this.elide.fetch.perform('healthRecords', {
      eq: { wikiId: location.attributes.wikiId },
      isIn: {
        referenceDate: [yesterdayString],
      },
      fields: {
        healthRecords: ['totalConfirmedCases', 'numActiveCases'],
      },
      limit: 1,
    });
    const yesterdayRecord = yesterdayHealthRecords[0]?.attributes;

    this.updateDailyNumbers(todayRecord, yesterdayRecord);

    this.loading = false;
  }).restartable())
  fetchSummaryRecord;

  updateDailyNumbers(todayRecord, yesterdayRecord) {
    if (!todayRecord || !yesterdayRecord) return;

    this.dailyActiveCasesDiff = null;
    this.totalConfirmedCasesDiff = null;
    this.totalConfirmedCasesDiffPercent = null;

    if (todayRecord.numActiveCases !== null && yesterdayRecord.numActiveCases !== null) {
      this.dailyActiveCasesDiff = todayRecord.numActiveCases - yesterdayRecord.numActiveCases;
    }

    if (todayRecord.totalConfirmedCases !== null && yesterdayRecord.totalConfirmedCases !== null) {
      this.totalConfirmedCasesDiff = todayRecord.totalConfirmedCases - yesterdayRecord.totalConfirmedCases;
      this.totalConfirmedCasesDiffPercent = todayRecord.totalConfirmedCases / yesterdayRecord.totalConfirmedCases - 1;
    }
  }
}
