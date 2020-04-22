/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE.md file for terms.
 */
import { singularize, pluralize } from 'covid-19-dashboard/utils/inflector';
import { module, test } from 'qunit';

module('Unit | Utility | inflector', function () {
  test('singularize', function (assert) {
    assert.equal(singularize('counties'), 'county', 'singularize can singularize counties');
    assert.equal(singularize('states'), 'state', 'singularize can singularize states');
    assert.equal(singularize('countries'), 'country', 'singularize can singularize countries');
    assert.equal(singularize('foo'), 'foo', 'singularize returns the given word if missing from its map');
  });

  test('pluralize', function (assert) {
    assert.equal(pluralize('county'), 'counties', 'pluralize can pluralize county');
    assert.equal(pluralize('state'), 'states', 'pluralize can pluralize state');
    assert.equal(pluralize('country'), 'countries', 'pluralize can pluralize country');
    assert.equal(pluralize('foo'), 'foo', 'pluralize returns the given word if missing from its map');
  });
});
