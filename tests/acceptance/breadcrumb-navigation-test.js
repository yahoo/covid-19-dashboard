import { module, test } from 'qunit';
import { click, currentURL, visit } from '@ember/test-helpers';
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

module('Acceptance | breadcrumb navigation', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('breadcrumb navigation', async function (assert) {
    await visit('/Jefferson_County,_Alabama');

    assert.equal(currentURL(), '/Jefferson_County,_Alabama', 'Start off at a location');
    assertTitle(assert, 'Jefferson County, Alabama');
    assertGlobalDetails(assert);
    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'Alabama', href: '/Alabama' },
      { title: 'Jefferson County, Alabama', href: '/Jefferson_County,_Alabama' },
    ]);
    assertLocationDetails(assert, {
      title: 'Jefferson County, Alabama Details',
      population: '658,573',
      wikiId: 'Jefferson_County,_Alabama',
    });

    assertMap(assert, {
      markerCount: 126,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '900',
      fatalTotal: '46',
      recoveredTotal: '--',
    });
    assertBreakdownTable(assert, {
      rows: [],
    });

    // Click on Alabama

    await click('.breadcrumb a:nth-of-type(3)');

    assert.equal(currentURL(), '/Alabama', 'Clicking a breadcrumb item transitions to that location');
    assertTitle(assert, 'Alabama');
    assertGlobalDetails(assert);
    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'Alabama', href: '/Alabama' },
    ]);
    assertLocationDetails(assert, {
      title: 'Alabama Details',
      population: '4,903,185',
      wikiId: 'Alabama',
    });

    assertMap(assert, {
      markerCount: 126,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '7,085',
      fatalTotal: '279',
      recoveredTotal: '--',
    });
    assertBreakdownTable(assert, {
      rows: [
        { title: 'Mobile County, Alabama', value: '1,078' },
        { title: 'Jefferson County, Alabama', value: '900' },
      ],
    });

    // Click on United States

    await click('.breadcrumb a:nth-of-type(2)');

    assert.equal(currentURL(), '/United_States', 'Clicking a breadcrumb item transitions to that location');
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
  });
});
