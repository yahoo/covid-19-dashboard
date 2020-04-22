import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Service | elide', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:elide');
  });

  test('it exists', function (assert) {
    assert.ok(this.service);
  });

  test('_buildUrl - search', function (assert) {
    const { service } = this;
    const actualUrl = service._buildUrl('counties', {
      search: { label: 'Cham' },
      fields: { counties: ['id', 'label'], states: ['label'] },
      include: ['states'],
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/counties?fields%5Bcounties%5D=id%2Clabel&fields%5Bstates%5D=label&filter=label%3D%3D%27*Cham*%27&include=states&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl build a url given a request'
    );
  });

  test('_buildFetchUrl - in list', function (assert) {
    const { service } = this;
    const actualUrl = service._buildUrl('counties', {
      isIn: {
        label: ['Champaign County, Illinois'],
        'state.id': [123],
      },
      fields: { counties: ['id', 'label'], states: ['label'] },
      include: ['states'],
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/counties?fields%5Bcounties%5D=id%2Clabel&fields%5Bstates%5D=label&filter=label%3Din%3D%28%27Champaign+County%5C%2C+Illinois%27%29%3Bstate.id%3Din%3D%28%27123%27%29&include=states&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl build a url given a request'
    );
  });

  test('_buildFetchUrl - null & eq', function (assert) {
    const { service } = this;
    const actualUrl = service._buildUrl('healthRecords', {
      eq: { referenceDate: '2020-04-03T00:00Z' },
      isNull: ['county', 'state', 'country'],
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/healthRecords?filter=referenceDate%3D%3D%272020-04-03T00%3A00Z%27%3Bcounty%3Disnull%3Dtrue%3Bstate%3Disnull%3Dtrue%3Bcountry%3Disnull%3Dtrue&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl build a url given a request'
    );
  });

  test('fetch - counties', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('counties', {
      isIn: { id: ['40e54368289c4795f51747e131d408bd'] },
      include: ['state'],
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            type: 'counties',
            id: '40e54368289c4795f51747e131d408bd',
            attributes: {
              label: 'Champaign County, Illinois',
              latitude: 40.13986,
              longitude: -88.19619,
              population: 201081,
              wikiId: 'Champaign_County,_Illinois',
            },
            relationships: {
              state: {
                data: {
                  type: 'states',
                  id: '66c2b329479ee151b4c6b257c0b7a9b7',
                },
              },
            },
          },
        ],
        included: [
          {
            type: 'states',
            id: '66c2b329479ee151b4c6b257c0b7a9b7',
            attributes: {
              label: 'Illinois',
              latitude: 40.06446,
              longitude: -89.19884,
              population: 12600620,
              wikiId: 'Illinois',
            },
            relationships: {
              country: {
                data: {
                  type: 'countries',
                  id: '09d4bca31e2fd8b0f57f79f85ed42bd8',
                },
              },
              counties: {
                data: [], // Only Alabama has county relationships in the fixture data
              },
            },
          },
        ],
      },
      'fetch can return data for a request'
    );
  });

  test('fetch - search states', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('states', {
      search: { label: ['Ill'] },
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            type: 'states',
            id: '66c2b329479ee151b4c6b257c0b7a9b7',
            attributes: {
              label: 'Illinois',
              latitude: 40.06446,
              longitude: -89.19884,
              population: 12600620,
              wikiId: 'Illinois',
            },
            relationships: {
              country: {
                data: {
                  type: 'countries',
                  id: '09d4bca31e2fd8b0f57f79f85ed42bd8',
                },
              },
              counties: {
                data: [],
              },
            },
          },
        ],
      },
      'fetch can return data for a search request'
    );
  });

  test('fetch - no options', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('metadata');
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            attributes: {
              healthRecordsEndDate: '2020-04-03T00:00Z',
              healthRecordsStartDate: '2020-04-03T00:00Z',
              publishedDate: '2020-04-03T03:00Z',
            },
            id: 'info',
            type: 'metadata',
          },
        ],
      },
      'fetch can return data with no request options'
    );
  });

  test('fetch - relationship field filter', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('healthRecords', {
      eq: { 'country.wikiId': 'Italy' },
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            attributes: {
              label: 'Italy',
              dataSource: 'https://news.yahoo.com/coronavirus',
              latitude: 42.50382,
              longitude: 12.57347,
              numActiveCases: 85388,
              numDeaths: 0,
              numPendingTests: 0,
              numRecoveredCases: 0,
              numTested: 0,
              referenceDate: '2020-04-03T00:00Z',
              totalConfirmedCases: 119827,
              totalDeaths: 14681,
              totalRecoveredCases: 0,
              totalTestedCases: 0,
              type: 'healthRecords',
              wikiId: 'Italy',
            },
            id: '9025bd9a-6e24-35d7-a90e-e1a47eb409ff',
            relationships: {
              country: {
                data: { id: '1007e1b7f894dfbf72a0eaa80f3bc57e', type: 'countries' },
              },
              county: { data: null },
              state: { data: null },
            },
            type: 'health-records',
          },
        ],
      },
      'fetch can filter on relationship fields'
    );
  });

  test('fetch - escaped filter values', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('counties', {
      eq: { wikiId: 'Autauga_County,_Alabama' },
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            attributes: {
              label: 'Autauga County, Alabama',
              latitude: 32.50771,
              longitude: -86.66611,
              population: 54571,
              wikiId: 'Autauga_County,_Alabama',
            },
            id: '78fb973e0330b5bef80178cb2ee15544',
            relationships: {
              state: {
                data: {
                  type: 'states',
                  id: '213fe69502445ed67ae8b99d22838802',
                },
              },
            },
            type: 'counties',
          },
        ],
      },
      'fetch can return data with escaped filter values'
    );
  });

  test('trace id', async function (assert) {
    assert.expect(3);

    const { service } = this;
    let stateTraceID, countyTraceID;
    this.server.get('https://covid19.knowledge.yahoo.com/api/json/v1/counties', function (db, req) {
      countyTraceID = req.requestHeaders['x-trace-id'];
      assert.ok(countyTraceID, 'A unique id is generated per request');
    });

    this.server.get('https://covid19.knowledge.yahoo.com/api/json/v1/states', function (db, req) {
      stateTraceID = req.requestHeaders['x-trace-id'];
      assert.ok(stateTraceID, 'A unique id is generated per request');
    });

    await service.fetch.perform('counties', { eq: { wikiId: 'Autauga_County,_Alabama' } });
    await service.fetch.perform('states', { eq: { wikiId: 'Alabama' } });

    assert.notEqual(stateTraceID, countyTraceID, 'The headers have unique ids');
  });
});
