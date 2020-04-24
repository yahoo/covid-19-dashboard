/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import Service from '@ember/service';
import { w as words } from '@ember/string';
import { A as arr } from '@ember/array';

export default class SearchService extends Service {
  /**
   * Computes how closely two strings match, ignoring word order.
   * The higher the weight, the farther apart the two strings are.
   *
   * @method getPartialMatchWeight
   * @param {String} string - text being search
   * @param {String} query - search query
   * @returns {Number|undefined}
   *           Number representing how close query matches string
   *           undefined if no match
   */
  getPartialMatchWeight(string, query) {
    // Split search query into individual words
    let searchTokens = words(query.trim()),
      origString = string,
      stringTokens = words(string),
      allTokensFound = true;

    // Check that all words in the search query can be found in the given string
    for (let i = 0; i < searchTokens.length; i++) {
      if (string.indexOf(searchTokens[i]) === -1) {
        allTokensFound = false;
        break;
        // Remove matched tokens from string as they have already matched
      } else if (stringTokens.includes(searchTokens[i])) {
        string = string.replace(searchTokens[i], '');
        // Partial match of a token must start with the search-token
        // (avoid age matching language)
      } else if (stringTokens.every(token => !token.startsWith(searchTokens[i]))) {
        allTokensFound = false;
        break;
      }
    }

    if (allTokensFound) {
      // Compute match weight
      return origString.length - query.trim().length + 1;
    }

    // Undefined weight if no match at all
    return undefined;
  }

  /**
   * Searches records by searchField and returns results sorted by relevance
   *
   * @method searchRecords
   * @param {Array} records - collection of records to search
   * @param {String} query - search query used to filter and rank records
   * @param {String} searchField - field in record to compare
   * @returns {Array} array of matching records
   */
  searchRecords(records, query, searchField) {
    let results = arr();
    query = query.toLowerCase();

    for (let i = 0; i < records.length; i++) {
      let record = records[i],
        relevance = this.getPartialMatchWeight(record[searchField].toLowerCase(), query);

      if (relevance) {
        results.push({ relevance, record });
      }
    }

    return arr(results.sortBy('relevance')).mapBy('record');
  }
}
