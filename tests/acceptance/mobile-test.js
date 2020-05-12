import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Service from '@ember/service';
import {
  assertBreadCrumb,
  assertBreakdownTable,
  assertLocationCaseDetails,
  assertGlobalDetails,
  assertLocationDetails,
  assertMap,
} from '../helpers/dashboard-asserts';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';

module('Acceptance | mobile', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  hooks.beforeEach(function () {
    this.owner.register(
      'service:screen',
      class extends Service {
        isMobile = true;
      }
    );
  });

  test('visiting /Earth', async function (assert) {
    await visit('/Earth');
    assert.equal(currentURL(), '/Earth', '/Earth loads the Earth location');

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    assertGlobalDetails(assert, '.dashboard__location-case-details');

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      rows: [
        { title: 'United States', value: '1,069,826' },
        { title: 'Spain', value: '215,216' },
      ],
    });
  });

  test('visiting a country - /United_States', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      rows: [
        { title: 'New York (state)', value: '304,372' },
        { title: 'New Jersey', value: '118,652' },
      ],
    });
  });

  test('visiting a state - /Alabama', async function (assert) {
    await visit('/Alabama');
    assert.equal(currentURL(), '/Alabama', '/Alabama loads the Alabama location');

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      rows: [
        { title: 'Mobile County, Alabama', value: '1,078' },
        { title: 'Jefferson County, Alabama', value: '900' },
      ],
    });
  });

  test('visiting a county - /Jefferson_County,_Alabama', async function (assert) {
    await visit('/Jefferson_County,_Alabama');
    assert.equal(
      currentURL(),
      '/Jefferson_County,_Alabama',
      '/Jefferson_County,_Alabama loads the Jefferson County, Alabama location'
    );

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      rows: [],
    });
  });

  test('visiting a location resets to detail view', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases', 'Case breakdown view is active after clicking the tab');

    await click(`.location-table__list li:nth-of-type(1) div`);
    assert.equal(currentURL(), '/New_York_(state)', 'Clicking `New York (state)` loads the correct location');

    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active when visiting a new location');
    assert.dom('.dashboard__map-details-header__title').hasText('New York (state) Details', 'Detail view is displayed');
    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
  });

  test('searching for a location resets to detail view', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');

    await click('.mobile-tabs__tab:not(.is-active)');
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases', 'Case breakdown view is active after clicking the tab');

    await selectSearch('.search-bar', 'Alab');
    await selectChoose('.search-bar', 'Alabama');

    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active when visiting a new location');
    assert.dom('.dashboard__map-details-header__title').hasText('Alabama Details', 'Detail view is displayed');
    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
  });
});
