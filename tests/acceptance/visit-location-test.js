import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
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

module('Acceptance | visit location', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function (assert) {
    await visit('/');
    assert.equal(currentURL(), '/Earth', 'The index route redirects to Earth location');
  });

  test('visiting /Not-A-Location redirect to /Earth', async function (assert) {
    await visit('/Not-A-Location');
    assert.equal(currentURL(), '/Earth', 'An invalid location redirects to Earth location');
  });

  test('visiting /Earth', async function (assert) {
    await visit('/Earth');
    assert.equal(currentURL(), '/Earth', '/Earth loads the Earth location');

    assertTitle(assert, 'Earth');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      rows: [
        { title: 'United States', value: '1,069,826' },
        { title: 'Spain', value: '215,216' },
      ],
    });

    assertBreadCrumb(assert, [{ title: 'Global', href: '/' }]);

    assertMap(assert, {
      markerCount: 65,
      showPin: false,
    });

    assertLocationDetails(assert, {
      title: 'Earth Details',
      population: '7,594,000,000',
      wikiId: 'Earth',
    });

    assert
      .dom('.dashboard__location-case-details')
      .doesNotExist('Earth location does not show location specific case details');
  });

  test('visiting a country - /United_States', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');

    assertTitle(assert, 'United States');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      rows: [
        { title: 'New York (state)', value: '304,372' },
        { title: 'New Jersey', value: '118,652' },
      ],
    });

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
    ]);

    assertMap(assert, {
      markerCount: 65,
      showPin: true,
    });

    assertLocationDetails(assert, {
      title: 'United States Details',
      population: '326,687,501',
      wikiId: 'United_States',
    });

    assertLocationCaseDetails(assert, {
      casesTotal: '1,069,826',
      fatalTotal: '63,006',
      recoveredTotal: '--',
    });
  });

  test('visiting a state - /Alabama', async function (assert) {
    await visit('/Alabama');
    assert.equal(currentURL(), '/Alabama', '/Alabama loads the Alabama location');

    assertTitle(assert, 'Alabama');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      rows: [
        { title: 'Mobile County, Alabama', value: '1,078' },
        { title: 'Jefferson County, Alabama', value: '900' },
      ],
    });

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'Alabama', href: '/Alabama' },
    ]);

    assertMap(assert, {
      markerCount: 126,
      showPin: true,
    });

    assertLocationDetails(assert, {
      title: 'Alabama Details',
      population: '4,903,185',
      wikiId: 'Alabama',
    });

    assertLocationCaseDetails(assert, {
      casesTotal: '7,085',
      fatalTotal: '279',
      recoveredTotal: '--',
    });
  });

  test('visiting a county - /Jefferson_County,_Alabama', async function (assert) {
    await visit('/Jefferson_County,_Alabama');
    assert.equal(
      currentURL(),
      '/Jefferson_County,_Alabama',
      '/Jefferson_County,_Alabama loads the Jefferson County, Alabama location'
    );

    assertTitle(assert, 'Jefferson County, Alabama');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      rows: [],
    });

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'Alabama', href: '/Alabama' },
      { title: 'Jefferson County, Alabama', href: '/Jefferson_County,_Alabama' },
    ]);

    assertMap(assert, {
      markerCount: 126,
      showPin: true,
    });

    assertLocationDetails(assert, {
      title: 'Jefferson County, Alabama Details',
      population: '658,573',
      wikiId: 'Jefferson_County,_Alabama',
    });

    assertLocationCaseDetails(assert, {
      casesTotal: '900',
      fatalTotal: '46',
      recoveredTotal: '--',
    });
  });
});
