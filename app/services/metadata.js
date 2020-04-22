/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class MetadataService extends Service {
  @service elide;
  @tracked metadata;

  fetch() {
    return this.fetchTask.perform();
  }

  @(task(function* () {
    const metadata = yield this.elide.fetch.perform('metadata');
    this.metadata = metadata.data[0].attributes;
    return this.metadata;
  }).restartable())
  fetchTask;

  get publishedDate() {
    return this.metadata?.publishedDate;
  }

  get healthRecordsEndDate() {
    return this.metadata?.healthRecordsEndDate;
  }

  get timeSinceRefresh() {
    const { metadata } = this;
    if (!metadata) return null;

    const publishedTime = Date.parse(metadata.publishedDate);
    const currentTime = new Date().getTime();
    return Math.round((currentTime - publishedTime) / (1000 * 60));
  }
}
