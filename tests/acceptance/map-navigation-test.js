import { module, test } from 'qunit';
import { click, findAll, visit, currentURL, settled } from '@ember/test-helpers';
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
    await settled();

    assert.equal(currentURL(), '/United_States', 'Start off at a location');
    assertTitle(assert, 'United States');
    assertGlobalDetails(assert);
    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
    ]);
    assertLocationDetails(assert, {
      title: 'United States Details',
      population: '328,239,523',
      wikiId: 'United_States',
    });

    await settled();

    assertMap(assert, {
      markerCount: 221,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '261,438',
      casesChange: '-- | --',
      activeTotal: '0',
      activeChange: '--',
      fatalTotal: '6,699',
      fatalChange: '0',
      recoveredTotal: '0',
      recoveredChange: '0',
    });
    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by State',
      rows: [
        { title: 'New York (state)', value: '102,863' },
        { title: 'New Jersey', value: '25,590' },
      ],
    });

    const australia = findAll('.location-marker')[8];
    await click(australia);
    await settled();

    assert.equal(currentURL(), '/Australia', 'Clicking on a map location transitions to that location');
    assertTitle(assert, 'Australia');
    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'Australia', href: '/Australia' },
    ]);
    assertLocationDetails(assert, {
      title: 'Australia Details',
      population: '19,978,100',
      wikiId: 'Australia',
    });

    await settled();

    assertMap(assert, {
      markerCount: 221,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '5,330',
      casesChange: '-- | --',
      activeTotal: '4,653',
      activeChange: '--',
      fatalTotal: '28',
      fatalChange: '0',
      recoveredTotal: '0',
      recoveredChange: '0',
    });
    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by Country',
      rows: [
        { title: 'United States', value: '261,438' },
        { title: 'Italy', value: '119,827' },
      ],
    });
  });
});
