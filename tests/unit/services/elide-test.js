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
      fields: { counties: ['id', 'label'], parents: ['label'] },
      include: ['parents'],
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/counties?fields%5Bcounties%5D=id%2Clabel&fields%5Bparents%5D=label&filter=label%3D%3D%27*Cham*%27&include=parents&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl build a url given a request'
    );
  });

  test('_buildFetchUrl - in list', function (assert) {
    const { service } = this;
    const actualUrl = service._buildUrl('counties', {
      isIn: {
        label: ['Champaign County, Illinois'],
        'parents.id': [123],
      },
      fields: { place: ['id', 'label'], parents: ['label'] },
      include: ['parents'],
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/counties?fields%5Bplace%5D=id%2Clabel&fields%5Bparents%5D=label&filter=label%3Din%3D%28%27Champaign+County%5C%2C+Illinois%27%29%3Bparents.id%3Din%3D%28%27123%27%29&include=parents&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl build a url given a request'
    );
  });

  test('_buildFetchUrl - null & eq', function (assert) {
    const { service } = this;
    const actualUrl = service._buildUrl('healthRecords', {
      eq: { referenceDate: '2020-04-03T00:00Z' },
      isNull: ['dataSource'],
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/healthRecords?filter=referenceDate%3D%3D%272020-04-03T00%3A00Z%27%3BdataSource%3Disnull%3Dtrue&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl builds a url given a request'
    );
  });

  test('_buildFetchUrl - gt, lt, ge & le', function (assert) {
    const { service } = this;
    const actualUrl = service._buildUrl('healthRecords', {
      gt: { referenceDate: '2020-04-03T00:00Z' },
      ge: { referenceDate: '2020-04-04T00:00Z' },
      lt: { referenceDate: '2020-05-01T00:00Z' },
      le: { referenceDate: '2020-04-30T00:00Z' },
    });
    assert.equal(
      actualUrl.toString(),
      'https://covid19.knowledge.yahoo.com/api/json/v1/healthRecords?filter=referenceDate%3Dlt%3D2020-05-01T00%3A00Z%3BreferenceDate%3Dgt%3D2020-04-03T00%3A00Z%3BreferenceDate%3Dle%3D2020-04-30T00%3A00Z%3BreferenceDate%3Dge%3D2020-04-04T00%3A00Z&page%5Boffset%5D=0&page%5Blimit%5D=4000',
      '_buildSearchUrl builds a url given a request'
    );
  });

  test('fetch - by id', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('places', {
      isIn: { id: ['Champaign_County,_Illinois'] },
      include: ['parents'],
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            type: 'places',
            id: 'Champaign_County,_Illinois',
            attributes: {
              type: 'places',
              label: 'Champaign County, Illinois',
              latitude: 40.13986,
              longitude: -88.19619,
              placeType: 'CountyAdminArea',
              population: 209689,
              wikiId: 'Champaign_County,_Illinois',
              childrenIds: [],
            },
            relationships: {
              children: {
                data: [],
              },
              parents: {
                data: [
                  {
                    type: 'places',
                    id: 'Illinois',
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: 'places',
            id: 'Illinois',
            attributes: {
              type: 'places',
              label: 'Illinois',
              latitude: 40.06446,
              longitude: -89.19884,
              placeType: 'StateAdminArea',
              population: 12671821,
              wikiId: 'Illinois',
              childrenIds: [
                'DuPage_River',
                'Lee_County,_Illinois',
                'Bond_County,_Illinois',
                'Cass_County,_Illinois',
                'Clay_County,_Illinois',
                'Cook_County,_Illinois',
                'Ford_County,_Illinois',
                'Kane_County,_Illinois',
                'Knox_County,_Illinois',
                'Lake_County,_Illinois',
                'Ogle_County,_Illinois',
                'Pike_County,_Illinois',
                'Pope_County,_Illinois',
                'Will_County,_Illinois',
                'Adams_County,_Illinois',
                'Boone_County,_Illinois',
                'Brown_County,_Illinois',
                'Clark_County,_Illinois',
                'Coles_County,_Illinois',
                'Edgar_County,_Illinois',
                'Henry_County,_Illinois',
                'Logan_County,_Illinois',
                'Macon_County,_Illinois',
                'Mason_County,_Illinois',
                'Perry_County,_Illinois',
                'Piatt_County,_Illinois',
                'Scott_County,_Illinois',
                'Stark_County,_Illinois',
                'Union_County,_Illinois',
                'Wayne_County,_Illinois',
                'White_County,_Illinois',
                'Bureau_County,_Illinois',
                'DeKalb_County,_Illinois',
                'DeWitt_County,_Illinois',
                'Fulton_County,_Illinois',
                'Greene_County,_Illinois',
                'Grundy_County,_Illinois',
                'Hardin_County,_Illinois',
                'Jasper_County,_Illinois',
                'Jersey_County,_Illinois',
                'Marion_County,_Illinois',
                'Massac_County,_Illinois',
                'McLean_County,_Illinois',
                'Menard_County,_Illinois',
                'Mercer_County,_Illinois',
                'Monroe_County,_Illinois',
                'Morgan_County,_Illinois',
                'Peoria_County,_Illinois',
                'Putnam_County,_Illinois',
                'Saline_County,_Illinois',
                'Shelby_County,_Illinois',
                'Wabash_County,_Illinois',
                'Warren_County,_Illinois',
                'Calhoun_County,_Illinois',
                'Carroll_County,_Illinois',
                'Clinton_County,_Illinois',
                'Douglas_County,_Illinois',
                'Edwards_County,_Illinois',
                'Fayette_County,_Illinois',
                'Hancock_County,_Illinois',
                'Jackson_County,_Illinois',
                'Johnson_County,_Illinois',
                'Kendall_County,_Illinois',
                'LaSalle_County,_Illinois',
                'Madison_County,_Illinois',
                'McHenry_County,_Illinois',
                'Pulaski_County,_Illinois',
                'Crawford_County,_Illinois',
                'Franklin_County,_Illinois',
                'Gallatin_County,_Illinois',
                'Hamilton_County,_Illinois',
                'Iroquois_County,_Illinois',
                'Kankakee_County,_Illinois',
                'Lawrence_County,_Illinois',
                'Macoupin_County,_Illinois',
                'Marshall_County,_Illinois',
                'Moultrie_County,_Illinois',
                'Randolph_County,_Illinois',
                'Richland_County,_Illinois',
                'Sangamon_County,_Illinois',
                'Schuyler_County,_Illinois',
                'Tazewell_County,_Illinois',
                'Woodford_County,_Illinois',
                'Alexander_County,_Illinois',
                'Champaign_County,_Illinois',
                'Christian_County,_Illinois',
                'Effingham_County,_Illinois',
                'Henderson_County,_Illinois',
                'Jefferson_County,_Illinois',
                'McDonough_County,_Illinois',
                'St._Clair_County,_Illinois',
                'Vermilion_County,_Illinois',
                'Whiteside_County,_Illinois',
                'Winnebago_County,_Illinois',
                'Cumberland_County,_Illinois',
                'Jo_Daviess_County,_Illinois',
                'Livingston_County,_Illinois',
                'Montgomery_County,_Illinois',
                'Stephenson_County,_Illinois',
                'Washington_County,_Illinois',
                'Williamson_County,_Illinois',
                'Rock_Island_County,_Illinois',
              ],
            },
            relationships: {
              children: {
                data: [],
              },
              parents: {
                data: [
                  {
                    type: 'places',
                    id: 'United_States',
                  },
                ],
              },
            },
          },
        ],
      },
      'fetch can return data for a request'
    );
  });

  test('fetch - search', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('places', {
      search: { label: ['Denma'] },
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            type: 'places',
            id: 'Denmark',
            attributes: {
              type: 'places',
              label: 'Denmark',
              placeType: 'Country',
              latitude: 56.27609,
              longitude: 9.51695,
              population: 5793636,
              wikiId: 'Denmark',
              childrenIds: [],
            },
            relationships: {
              children: {
                data: [],
              },
              parents: {
                data: [
                  {
                    type: 'places',
                    id: 'Earth',
                  },
                ],
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
    const actualData = await service.fetch.perform('latestHealthRecords', {
      eq: { 'place.wikiId': 'Italy' },
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            type: 'latest-health-records',
            id: 'df1d490f-b313-39af-bcd1-2e747e8765e8',
            attributes: {
              dataSource: 'http://www.salute.gov.it/',
              label: 'Italy',
              latitude: 42.50382,
              longitude: 12.57347,
              numDeaths: null,
              numRecoveredCases: null,
              numTested: null,
              referenceDate: '2020-05-01T00:00Z',
              totalConfirmedCases: 205463,
              totalDeaths: 27967,
              totalRecoveredCases: 75945,
              totalTestedCases: 1979217,
              type: 'latestHealthRecords',
              wikiId: 'Italy',
            },
            relationships: {
              place: {
                data: {
                  type: 'places',
                  id: 'Italy',
                },
              },
            },
          },
        ],
      },
      'fetch can filter on relationship fields'
    );
  });

  test('fetch - to many relationship filter', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('latestHealthRecords', {
      eq: { 'place.parents.id': 'Earth' },
    });
    assert.deepEqual(actualData.data.length, 23, 'fetch can filter on relationship fields');

    assert.deepEqual(
      actualData.data.find((r) => r.attributes.label === 'United States'),
      {
        attributes: {
          dataSource: 'https://www.ecdc.europa.eu/',
          label: 'United States',
          latitude: 37.16793,
          longitude: -95.84502,
          numDeaths: null,
          numRecoveredCases: null,
          numTested: null,
          referenceDate: '2020-05-01T00:00Z',
          totalConfirmedCases: 1069826,
          totalDeaths: 63006,
          totalRecoveredCases: null,
          totalTestedCases: null,
          type: 'latestHealthRecords',
          wikiId: 'United_States',
        },
        id: '0a5e3287-5fd4-391e-869c-9096491b5c46',
        relationships: {
          place: {
            data: {
              id: 'United_States',
              type: 'places',
            },
          },
        },
        type: 'latest-health-records',
      },
      'fetch can filter on relationship fields'
    );
  });

  test('fetch - escaped filter values', async function (assert) {
    const { service } = this;
    const actualData = await service.fetch.perform('places', {
      eq: { id: 'Autauga_County,_Alabama' },
    });
    assert.deepEqual(
      actualData,
      {
        data: [
          {
            type: 'places',
            id: 'Autauga_County,_Alabama',
            attributes: {
              type: 'places',
              label: 'Autauga County, Alabama',
              latitude: 32.50771,
              longitude: -86.66611,
              placeType: 'CountyAdminArea',
              population: 55869,
              wikiId: 'Autauga_County,_Alabama',
              childrenIds: [],
            },
            relationships: {
              children: {
                data: [],
              },
              parents: {
                data: [
                  {
                    type: 'places',
                    id: 'Alabama',
                  },
                ],
              },
            },
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
