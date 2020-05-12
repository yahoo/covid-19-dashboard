import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Service from '@ember/service';

import {
  assertBreadCrumb,
  assertLocationCaseDetails,
  assertLocationDetails,
  assertTitle,
} from '../helpers/dashboard-asserts';

module('Acceptance | table navigation', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('navigating to a location via the table - desktop', async function (assert) {
    await visit('/California');
    assert.equal(currentURL(), '/California', 'Start off at a location');
    assertTitle(assert, 'California');

    await click(`.location-table__list li:nth-of-type(1) div`);

    assert.equal(
      currentURL(),
      '/Los_Angeles_County,_California',
      'Clicking on a table location transitions to that location'
    );
    assertTitle(assert, 'Los Angeles County, California');

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'California', href: '/California' },
      { title: 'Los Angeles County, California', href: '/Los_Angeles_County,_California' },
    ]);

    assertLocationDetails(assert, {
      title: 'Los Angeles County, California Details',
      population: '10,039,107',
      wikiId: 'Los_Angeles_County,_California',
    });

    assertLocationCaseDetails(assert, {
      casesTotal: '23,284',
      fatalTotal: '1,111',
      recoveredTotal: '--',
    });
  });

  test('navigating to a location via the table - mobile', async function (assert) {
    this.owner.register(
      'service:screen',
      class extends Service {
        isMobile = true;
      }
    );
    await visit('/California');
    assert.equal(currentURL(), '/California', 'Start off at a location');
    assertTitle(assert, 'California');

    await click('.mobile-tabs__tab:not(.is-active)');

    await click(`.location-table__list li:nth-of-type(1) div`);

    assert.equal(
      currentURL(),
      '/Los_Angeles_County,_California',
      'Clicking on a table location transitions to that location'
    );
    assertTitle(assert, 'Los Angeles County, California');

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'California', href: '/California' },
      { title: 'Los Angeles County, California', href: '/Los_Angeles_County,_California' },
    ]);

    assertLocationDetails(assert, {
      title: 'Los Angeles County, California Details',
      population: '10,039,107',
      wikiId: 'Los_Angeles_County,_California',
    });

    assertLocationCaseDetails(assert, {
      casesTotal: '23,284',
      fatalTotal: '1,111',
      recoveredTotal: '--',
    });
  });
});
