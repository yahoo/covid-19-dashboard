/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Service from '@ember/service';
import ENV from 'covid-19-dashboard/config/environment';
import { task } from 'ember-concurrency';
import { v1 } from 'uuid';

const { host, namespace = '' } = ENV.APP;

const escape = (value) => {
  const fn = (v) => `${('' + v).replace(/'/g, "\\'").replace(/,/g, '\\,')}`;
  if (Array.isArray(value)) {
    return value.map(fn);
  }
  return fn(value);
};

const operators = {
  eq: (f, v) => `${f}=='${escape(v)}'`,
  isIn: (f, v) =>
    `${f}=in=(${escape(v)
      .map((e) => `'${e}'`)
      .join(',')})`,
  search: (f, v) => `${f}=='*${v}*'`,
  isNull: (f, v) => `${v}=isnull=true`,
  notNull: (f, v) => `${v}=isnull=false`,
  lt: (f, v) => `${f}=lt=${v}`,
  gt: (f, v) => `${f}=gt=${v}`,
  le: (f, v) => `${f}=le=${v}`,
  ge: (f, v) => `${f}=ge=${v})`,
};

export default class ElideService extends Service {
  _buildUrl(model, request = {}) {
    const { fields = {}, sort = null, include = [], offset = 0, limit = 4000 } = request;
    const url = new URL(`${host}${namespace}/${model}`);

    //fields
    Object.entries(fields).forEach(([key, val]) => url.searchParams.append(`fields[${key}]`, val.join(',')));

    //filters
    const filters = Object.keys(operators)
      .map((op) => {
        const filter = request[op] || {};
        return Object.entries(filter)
          .map(([f, v]) => {
            return operators[op](f, v);
          })
          .join(';');
      })
      .filter((f) => f)
      .join(';');

    if (filters.length) {
      url.searchParams.append('filter', filters);
    }

    if (sort) {
      url.searchParams.append('sort', sort);
    }

    //include
    if (include.length) {
      url.searchParams.append('include', include.join(','));
    }

    //pagination
    url.searchParams.append('page[offset]', offset);
    url.searchParams.append('page[limit]', limit);
    return url;
  }

  @task(function* (model, request) {
    const controller = new AbortController();
    const { signal } = controller;
    const traceId = v1();

    try {
      const url = this._buildUrl(model, request);
      const result = yield fetch(url, {
        headers: {
          'X-TRACE-ID': traceId,
        },
        signal,
      });
      const json = yield result.json();
      return json;
    } finally {
      controller.abort();
    }
  })
  fetch;
}
