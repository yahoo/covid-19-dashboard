import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Service | location', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it can fetch a location', async function (assert) {
    const service = this.owner.lookup('service:location');

    const earth = await service.fetchTask.perform('Earth');
    assert.equal(earth.id, 'Earth', '`fetch` can return Earth location');
    assert.equal(earth.attributes.placeType, 'AstronomicalObject', '`fetch` can return Earth location');

    const country = await service.fetchTask.perform('Italy');
    assert.equal(country.id, 'Italy', '`fetch` can return a country location');
    assert.equal(country.attributes.placeType, 'Country', '`fetch` can return a country location');

    const state = await service.fetchTask.perform('Florida');
    assert.equal(state.id, 'Florida', '`fetch` can return a state location');
    assert.equal(state.attributes.placeType, 'StateAdminArea', '`fetch` can return a state location');

    const county = await service.fetchTask.perform('Autauga_County,_Alabama');
    assert.equal(county.id, 'Autauga_County,_Alabama', '`fetch` can return a county location');
    assert.equal(county.attributes.placeType, 'CountyAdminArea', '`fetch` can return a county location');

    const missingLocation = await service.fetchTask.perform('Not_A_Location');
    assert.equal(missingLocation, undefined, '`fetch` returns undefined when a location is missing');
  });
});
