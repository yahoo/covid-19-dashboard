/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import BaseHelper from 'ember-intl/helpers/format-number';
import { isEmpty } from '@ember/utils';

export default class FormatHelper extends BaseHelper {
  compute([value], options) {
    if (isEmpty(value)) {
      return '--';
    }

    const formatted = this.format(value, options);
    if (value > 0 && options.showPlus === true) {
      return `+${formatted}`;
    }
    return formatted;
  }
}
