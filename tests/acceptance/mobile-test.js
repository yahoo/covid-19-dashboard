import { module, test } from 'qunit';
import { click, visit, currentURL, settled } from '@ember/test-helpers';
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
    await settled();

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    await settled();
    assertGlobalDetails(assert, '.dashboard__location-case-details');

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    await settled();
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases by Country', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by Country',
      rows: [
        { title: 'United States', value: '261,438' },
        { title: 'Italy', value: '119,827' },
      ],
    });
  });

  test('visiting a country - /United_States', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');
    await settled();

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    await settled();
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

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    await settled();
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases by State', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by State',
      rows: [
        { title: 'New York (state)', value: '102,863' },
        { title: 'New Jersey', value: '25,590' },
      ],
    });
  });

  test('visiting a state - /Alabama', async function (assert) {
    await visit('/Alabama');
    assert.equal(currentURL(), '/Alabama', '/Alabama loads the Alabama location');
    await settled();

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    await settled();
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases by County', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by County',
      rows: [
        { title: 'Jefferson County, Alabama', value: '345' },
        { title: 'Madison County, Alabama', value: '119' },
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
    await settled();

    assert.dom('.dashboard__global-case-details').doesNotExist('The mobile view does not display global case details');

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

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    await settled();
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases by County', 'Case breakdown view is active after clicking the tab');

    assertBreakdownTable(assert, {
      title: 'Confirmed Cases by County',
      rows: [
        { title: 'Jefferson County, Alabama', value: '345' },
        { title: 'Madison County, Alabama', value: '119' },
      ],
    });
  });

  test('visiting a location resets to detail view', async function (assert) {
    await visit('/United_States');
    assert.equal(currentURL(), '/United_States', '/United_States loads the United States location');
    await settled();

    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active');
    await click('.mobile-tabs__tab:not(.is-active)');
    await settled();
    assert
      .dom('.mobile-tabs__tab.is-active')
      .hasText('Confirmed Cases by State', 'Case breakdown view is active after clicking the tab');

    await click(`.location-table__list li:nth-of-type(1) div`);
    assert.equal(currentURL(), '/New_York_(state)', 'Clicking `New York (state)` loads the correct location');

    await settled();
    assert.dom('.mobile-tabs__tab.is-active').hasText('Details', 'Details view is active when visiting a new location');
    assert.dom('.dashboard__map-details-header__title').hasText('New York (state) Details', 'Detail view is displayed');
    assert.dom('.location-table').doesNotExist('Location table is not displayed in details view');
  });
});
