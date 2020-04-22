/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE.md file for terms.
 */
const toPlural = {
  county: 'counties',
  state: 'states',
  country: 'countries',
};

const toSingular = Object.entries(toPlural).reduce((acc, [k, v]) => Object.assign(acc, { [v]: k }), {});

export const singularize = (word) => toSingular[word] || word;
export const pluralize = (word) => toPlural[word] || word;
