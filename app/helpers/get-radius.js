/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import { helper } from '@ember/component/helper';
export default helper(function getRadius(param, { number, zoom }) {
  const value = Math.max(Math.min(number, 30000), 2000);
  return zoom > 5 ? value * 5 : value * 10;
});
