import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Service | metadata', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it can fetch metadata', async function (assert) {
    const service = this.owner.lookup('service:metadata');

    assert.equal(service.metadata, undefined, '`metadata` property is initially undefined');

    const metadata = await service.fetch();

    assert.deepEqual(
      metadata,
      {
        healthRecordsStartDate: '2020-04-03T00:00Z',
        healthRecordsEndDate: '2020-04-03T00:00Z',
        publishedDate: '2020-04-03T03:00Z',
      },
      '`fetch` returns api metadata'
    );

    assert.equal(metadata, service.metadata, '`metadata` property is populated after fetch');
  });

  test('healthRecordsEndDate', async function (assert) {
    const service = this.owner.lookup('service:metadata');

    assert.equal(service.healthRecordsEndDate, undefined, '`healthRecordsEndDate` property is initially undefined');

    await service.fetch();
    assert.equal(
      service.healthRecordsEndDate,
      '2020-04-03T00:00Z',
      '`healthRecordsEndDate` property is populated after fetch'
    );
  });

  test('timeSinceRefresh', async function (assert) {
    const service = this.owner.lookup('service:metadata');

    assert.equal(service.timeSinceRefresh, null, '`timeSinceRefresh` property is initially null');

    await service.fetch();
    assert.notOk(isNaN(service.timeSinceRefresh), '`timeSinceRefresh` property is populated after fetch');
  });
});
