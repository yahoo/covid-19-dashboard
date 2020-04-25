import { module, test } from 'qunit';
import { click, visit, currentURL, settled } from '@ember/test-helpers';
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
    await settled();
    assert.equal(currentURL(), '/California', 'Start off at a location');
    assertTitle(assert, 'California');

    await click(`.location-table__list li:nth-of-type(1) div`);
    await settled();

    assert.equal(currentURL(), '/New_York_(state)', 'Clicking on a table location transitions to that location');
    assertTitle(assert, 'New York (state)');

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'New York (state)', href: '/New_York_(state)' },
    ]);

    assertLocationDetails(assert, {
      title: 'New York (state) Details',
      population: '19,157,532',
      wikiId: 'New_York_(state)',
    });

    await settled();

    assertLocationCaseDetails(assert, {
      casesTotal: '102,863',
      casesChange: '-- | --',
      activeTotal: '0',
      activeChange: '--',
      fatalTotal: '2,935',
      fatalChange: '0',
      recoveredTotal: '0',
      recoveredChange: '0',
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
    await settled();
    assert.equal(currentURL(), '/California', 'Start off at a location');
    assertTitle(assert, 'California');

    await click('.mobile-tabs__tab:not(.is-active)');
    await settled();

    await click(`.location-table__list li:nth-of-type(1) div`);

    await settled();
    assert.equal(currentURL(), '/New_York_(state)', 'Clicking on a table location transitions to that location');
    assertTitle(assert, 'New York (state)');

    assertBreadCrumb(assert, [
      { title: 'Global', href: '/' },
      { title: 'United States', href: '/United_States' },
      { title: 'New York (state)', href: '/New_York_(state)' },
    ]);

    assertLocationDetails(assert, {
      title: 'New York (state) Details',
      population: '19,157,532',
      wikiId: 'New_York_(state)',
    });

    await settled();

    assertLocationCaseDetails(assert, {
      casesTotal: '102,863',
      casesChange: '-- | --',
      activeTotal: '0',
      activeChange: '--',
      fatalTotal: '2,935',
      fatalChange: '0',
      recoveredTotal: '0',
      recoveredChange: '0',
    });
  });
});
