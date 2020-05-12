import { module, test } from 'qunit';
import { visit, currentURL, findAll } from '@ember/test-helpers';
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
      ['Colorado', 'Coles County, Illinois', 'Colbert County, Alabama', 'Lincolnshire'],
      'Search can find counties, states, and countries'
    );
  });

  test('search api failure', async function (assert) {
    await visit('/');
    this.server.get('/places', () => new Response(401));
    await selectSearch('.search-bar', 'Alab');
    assert
      .dom('.ember-power-select-option--no-matches-message')
      .hasText('No matches found', 'A search error message is displayed if the api returns an error');
  });

  test('search and navigate to a location', async function (assert) {
    await visit('/Illinois');
    assert.equal(currentURL(), '/Illinois', 'Start off at the default route');
    assertTitle(assert, 'Illinois');

    await selectSearch('.search-bar', 'Alab');
    await selectChoose('.search-bar', 'Alabama');
    assert.equal(currentURL(), '/Alabama', 'Selecting `Alabama` from the results transitions to the correct location');
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
});
