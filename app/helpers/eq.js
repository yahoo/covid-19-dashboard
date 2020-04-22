/**
 * Copyright 2020, Verizon Media.
 * Licensed under the terms of the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import { helper } from '@ember/component/helper';

export default helper(function neq([left, right] /*, hash*/) {
  return left === right;
});
