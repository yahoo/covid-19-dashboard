import { module, test } from 'qunit';
import { visit, currentURL, settled } from '@ember/test-helpers';
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
    await settled();
    assert.equal(currentURL(), '/Earth', '/Earth loads the Earth location');

    assertTitle(assert, 'Earth');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by Country',
      rows: [
        { title: 'United States', value: '261,438' },
        { title: 'Italy', value: '119,827' },
      ],
    });

    assertBreadCrumb(assert, [{ title: 'Global', href: '/' }]);

    assertMap(assert, {
      markerCount: 221,
      showPin: false,
    });

    assertLocationDetails(assert, {
      title: 'Earth Details',
      population: '--',
      wikiId: 'Earth',
    });

    assert
      .dom('.dashboard__location-case-details')
      .doesNotExist('Earth location does not show location specific case details');
  });

  test('visiting a country - /United_States', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');
    await settled();

    assertTitle(assert, 'United States');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by State',
      rows: [
        { title: 'New York (state)', value: '102,863' },
        { title: 'New Jersey', value: '25,590' },
      ],
    });

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
    ]);

    assertMap(assert, {
      markerCount: 221,
      showPin: true,
    });

    assertLocationDetails(assert, {
      title: 'United States Details',
      population: '328,239,523',
      wikiId: 'United_States',
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
  });

  test('visiting a state - /Alabama', async function (assert) {
    await visit('/Alabama');
    assert.equal(currentURL(), '/Alabama', '/Alabama loads the Alabama location');
    await settled();

    assertTitle(assert, 'Alabama');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by County',
      rows: [
        { title: 'Jefferson County, Alabama', value: '345' },
        { title: 'Madison County, Alabama', value: '119' },
      ],
    });

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'Alabama', href: '/Alabama' },
    ]);

    assertMap(assert, {
      markerCount: 284,
      showPin: true,
    });

    assertLocationDetails(assert, {
      title: 'Alabama Details',
      population: '4,486,508',
      wikiId: 'Alabama',
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
  });

  test('visiting a county - /Jefferson_County,_Alabama', async function (assert) {
    await visit('/Jefferson_County,_Alabama');
    assert.equal(
      currentURL(),
      '/Jefferson_County,_Alabama',
      '/Jefferson_County,_Alabama loads the Jefferson County, Alabama location'
    );
    await settled();

    assertTitle(assert, 'Jefferson County, Alabama');

    assertGlobalDetails(assert);

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by County',
      rows: [
        { title: 'Jefferson County, Alabama', value: '345' },
        { title: 'Madison County, Alabama', value: '119' },
      ],
    });

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'Alabama', href: '/Alabama' },
      { title: 'Jefferson County, Alabama', href: '/Jefferson_County,_Alabama' },
    ]);

    assertMap(assert, {
      markerCount: 284,
      showPin: true,
    });

    assertLocationDetails(assert, {
      title: 'Jefferson County, Alabama Details',
      population: '662,047',
      wikiId: 'Jefferson_County,_Alabama',
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
  });
});
