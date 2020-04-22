/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE.md file for terms.
 */

export function breakdownLocationType(location) {
  if (!location) return undefined;

  const { type, relationships } = location;
  switch (type) {
    case 'global':
      return 'country';
    case 'countries':
      if (relationships.states.data.length > 0) {
        return 'state';
      }
      return 'country';
    case 'states':
      if (relationships.counties.data.length > 0) {
        return 'county';
      }
      return 'state';
    case 'counties':
      return 'county';
  }

  return undefined;
}
