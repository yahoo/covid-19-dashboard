/**
 * Copyright 2020, Verizon Media.
 * Licensed under the Apache License, Version 2.0. See accompanying LICENSE file for terms.
 */
import { helper } from '@ember/component/helper';
import { isNone } from '@ember/utils';

export default helper(function formatTime([timeInMins]) {
  if (isNone(timeInMins)) return '--';
  if (timeInMins < 60) return `${timeInMins} mins`;
  else {
    let mins = timeInMins % 60;
    let hrs = Math.floor(timeInMins / 60);
    let days = Math.floor(hrs / 24);
    if (hrs > 24) hrs = Math.floor(hrs % 24);

    return days ? `${days}d ${hrs}h ${mins}m` : `${hrs}h ${mins}m`;
  }
});
