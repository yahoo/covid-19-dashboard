import { breakdownLocationType } from 'covid-19-dashboard/utils/location';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Utility | location', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('breakdownLocationType', async function (assert) {
    const service = this.owner.lookup('service:location');

    let location;
    assert.equal(breakdownLocationType(location), undefined, '`breakdownLocationType` property is initially undefined');

    location = await service.fetch('Earth');
    assert.equal(
      breakdownLocationType(location),
      'country',
      '`breakdownLocationType` property is `country` when location is Earth'
    );

    location = await service.fetch('United_States');
    assert.equal(
      breakdownLocationType(location),
      'state',
      '`breakdownLocationType` property is `state` when country location has states'
    );

    location = await service.fetch('Italy');
    assert.equal(
      breakdownLocationType(location),
      'country',
      '`breakdownLocationType` property is `state` when country location does not have states'
    );

    location = await service.fetch('Alabama');
    assert.equal(
      breakdownLocationType(location),
      'county',
      '`breakdownLocationType` property is `county` when state location has counties'
    );

    location = await service.fetch('Florida');
    assert.equal(
      breakdownLocationType(location),
      'state',
      '`breakdownLocationType` property is `state` when state location does not have counties'
    );

    location = await service.fetch('Autauga_County,_Alabama');
    assert.equal(
      breakdownLocationType(location),
      'county',
      '`breakdownLocationType` property is `county` when location is a county'
    );
  });
});
