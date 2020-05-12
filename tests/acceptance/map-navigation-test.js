import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import {
  assertBreadCrumb,
  assertBreakdownTable,
  assertGlobalDetails,
  assertLocationCaseDetails,
  assertLocationDetails,
  assertMap,
  assertTitle,
} from '../helpers/dashboard-asserts';

module('Acceptance | map navigation', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('map navigation', async function (assert) {
    await visit('/United_States');

    assert.equal(currentURL(), '/United_States', 'Start off at a location');
    assertTitle(assert, 'United States');
    assertGlobalDetails(assert);
    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
    ]);
    assertLocationDetails(assert, {
      title: 'United States Details',
      population: '326,687,501',
      wikiId: 'United_States',
    });

    assertMap(assert, {
      markerCount: 65,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '1,069,826',
      fatalTotal: '63,006',
      recoveredTotal: '--',
    });
    assertBreakdownTable(assert, {
      rows: [
        { title: 'New York (state)', value: '304,372' },
        { title: 'New Jersey', value: '118,652' },
      ],
    });

    await click('.location-marker');

    assert.equal(currentURL(), '/Australia', 'Clicking on a map location transitions to that location');
    assertTitle(assert, 'Australia');
    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'Australia', href: '/Australia' },
    ]);
    assertLocationDetails(assert, {
      title: 'Australia Details',
      population: '24,982,688',
      wikiId: 'Australia',
    });

    assertMap(assert, {
      markerCount: 65,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '6,762',
      fatalTotal: '92',
      recoveredTotal: '5,720',
    });
    assertBreakdownTable(assert, {
      rows: [],
    });
  });
});
