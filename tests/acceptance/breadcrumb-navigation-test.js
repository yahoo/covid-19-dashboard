import { module, test } from 'qunit';
import { click, currentURL, settled, visit } from '@ember/test-helpers';
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
    await settled();

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
      population: '662,047',
      wikiId: 'Jefferson_County,_Alabama',
    });

    await settled();

    assertMap(assert, {
      markerCount: 284,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '345',
      casesChange: '-- | --',
      activeTotal: '0',
      activeChange: '--',
      fatalTotal: '0',
      fatalChange: '0',
      recoveredTotal: '0',
      recoveredChange: '0',
    });
    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by County',
      rows: [
        { title: 'Jefferson County, Alabama', value: '345' },
        { title: 'Madison County, Alabama', value: '119' },
      ],
    });

    // Click on Alabama

    await click('.breadcrumb a:nth-of-type(3)');
    await settled();

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
      population: '4,486,508',
      wikiId: 'Alabama',
    });

    await settled();

    assertMap(assert, {
      markerCount: 284,
      showPin: true,
    });
    assertLocationCaseDetails(assert, {
      casesTotal: '1,315',
      casesChange: '-- | --',
      activeTotal: '0',
      activeChange: '--',
      fatalTotal: '32',
      fatalChange: '0',
      recoveredTotal: '0',
      recoveredChange: '0',
    });
    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by County',
      rows: [
        { title: 'Jefferson County, Alabama', value: '345' },
        { title: 'Madison County, Alabama', value: '119' },
      ],
    });

    // Click on United States

    await click('.breadcrumb a:nth-of-type(2)');
    await settled();

    assert.equal(currentURL(), '/United_States', 'Clicking a breadcrumb item transitions to that location');
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
  });
});
