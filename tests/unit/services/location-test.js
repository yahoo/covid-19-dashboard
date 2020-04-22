import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Service | location', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it can fetch a location', async function (assert) {
    const service = this.owner.lookup('service:location');

    const earth = await service.fetch('Earth');
    assert.equal(earth.id, '5cdd21c97f86686cc505e02fd32a7523', '`fetch` can return Earth location');
    assert.equal(earth.type, 'global', '`fetch` can return Earth location');
    assert.equal(earth.country, undefined, '`fetch` can return Earth location');
    assert.equal(earth.state, undefined, '`fetch` can return Earth location');
    assert.equal(earth.county, undefined, '`fetch` can return Earth location');

    const country = await service.fetch('Italy');
    assert.equal(country.id, '1007e1b7f894dfbf72a0eaa80f3bc57e', '`fetch` can return a country location');
    assert.equal(country.type, 'countries', '`fetch` can return a country location');
    assert.equal(country.country, undefined, '`fetch` can return a country location');
    assert.equal(country.state, undefined, '`fetch` can return a country location');
    assert.equal(country.county, undefined, '`fetch` can return a country location');

    const state = await service.fetch('Florida');
    assert.equal(state.id, 'eeaca0ed2f6a35370c77de30792debb8', '`fetch` can return a state location');
    assert.equal(state.type, 'states', '`fetch` can return a state location');
    assert.equal(state.country.id, '09d4bca31e2fd8b0f57f79f85ed42bd8', '`fetch` can return a state location');
    assert.equal(state.state, undefined, '`fetch` can return a state location');
    assert.equal(state.county, undefined, '`fetch` can return a state location');

    const county = await service.fetch('Autauga_County,_Alabama');
    assert.equal(county.id, '78fb973e0330b5bef80178cb2ee15544', '`fetch` can return a county location');
    assert.equal(county.type, 'counties', '`fetch` can return a county location');
    assert.equal(county.country.id, '09d4bca31e2fd8b0f57f79f85ed42bd8', '`fetch` can return a county location');
    assert.equal(county.county, undefined, '`fetch` can return a county location');

    const missingLocation = await service.fetch('Not_A_Location');
    assert.equal(missingLocation, undefined, '`fetch` returns undefined when a location is missing');
  });
});
