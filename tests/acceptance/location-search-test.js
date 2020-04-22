import { module, test } from 'qunit';
import { visit, currentURL, settled, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { selectChoose, selectSearch } from 'ember-power-select/test-support';
import { Response } from 'ember-cli-mirage';

import {
  assertBreadCrumb,
  assertBreakdownTable,
  assertGlobalDetails,
  assertLocationCaseDetails,
  assertLocationDetails,
  assertMap,
  assertTitle,
} from '../helpers/dashboard-asserts';

module('Acceptance | location search', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('search for locations', async function (assert) {
    await visit('/');
    await settled();

    await selectSearch('.search-bar', 'z');
    assert
      .dom('.ember-power-select-option--no-matches-message')
      .hasText('No matches found', 'Search needs at least two characters');

    await selectSearch('.search-bar', 'zo');
    assert.dom('.ember-power-select-option').hasText('Arizona', 'Search can find a location with two characters');

    await selectSearch('.search-bar', 'Col');
    const locations = findAll('.ember-power-select-option').map((e) => e.textContent.trim());
    assert.deepEqual(
      locations,
      ['Colombia', 'Colorado', 'District of Columbia', 'Colbert County, Alabama'],
      'Search can find counties, states, and countries'
    );
  });

  test('search api failure', async function (assert) {
    await visit('/');
    this.server.get('/states', () => new Response(401));
    await selectSearch('.search-bar', 'Alab');
    assert
      .dom('.ember-power-select-option--no-matches-message')
      .hasText('No matches found', 'A search error message is displayed if the api returns an error');
  });

  test('search and navigate to a location', async function (assert) {
    await visit('/Illinois');
    await settled();
    assert.equal(currentURL(), '/Illinois', 'Start off at the default route');
    assertTitle(assert, 'Illinois');

    await selectSearch('.search-bar', 'Alab');
    await selectChoose('.search-bar', 'Alabama');
    await settled();
    assert.equal(currentURL(), '/Alabama', 'Selecting `Alabama` from the results transitions to the correct location');
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
});
