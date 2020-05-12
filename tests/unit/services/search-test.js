import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | search', function (hooks) {
  setupTest(hooks);

  test('getPartialMatchWeight', function (assert) {
    assert.expect(6);

    const service = this.owner.lookup('service:search');

    assert.equal(
      service.getPartialMatchWeight('heavy green character', 'kart weight'),
      undefined,
      'No match weight when query does not match'
    );

    assert.equal(
      service.getPartialMatchWeight('heavy green character', 'heavy yellow character'),
      undefined,
      'No match weight when not all words are found'
    );

    assert.equal(
      service.getPartialMatchWeight('heavy green character', 'character heavy'),
      7,
      'Match is found despite word order'
    );

    assert.equal(
      service.getPartialMatchWeight('great green character', 'great grea'),
      undefined,
      'Match not found when previous token is already accounted for'
    );

    assert.equal(
      service.getPartialMatchWeight('great green character', 'great gree'),
      12,
      'Match not found when previous token is already accounted for'
    );

    const weight1 = service.getPartialMatchWeight('heavy green character', 'character'),
      weight2 = service.getPartialMatchWeight('heavy green character', 'heavy character');
    assert.ok(weight1 > weight2, 'Closer match has smaller match weight');
  });

  test('searchRecords', function (assert) {
    assert.expect(2);

    const service = this.owner.lookup('service:search');

    let records = [
      {
        id: 'bike',
        description: 'All Bikes',
      },
      {
        id: '123456',
        description: 'Sport Bike',
      },
      {
        id: '1234567',
        description: 'Bowser',
      },
      {
        id: '123',
        description: 'Standard Kart',
      },
    ];

    assert.deepEqual(
      service.searchRecords(records, 'Bike', 'description'),
      [
        {
          description: 'All Bikes',
          id: 'bike',
        },
        {
          description: 'Sport Bike',
          id: '123456',
        },
        {
          id: '1234567',
          description: 'Bowser',
        },
        {
          id: '123',
          description: 'Standard Kart',
        },
      ],
      'The matching records are returned and sorted by relevance of description'
    );

    assert.deepEqual(
      service.searchRecords(records, '123', 'id'),
      [
        {
          description: 'Standard Kart',
          id: '123',
        },
        {
          description: 'Sport Bike',
          id: '123456',
        },
        {
          description: 'Bowser',
          id: '1234567',
        },
        {
          description: 'All Bikes',
          id: 'bike',
        },
      ],
      'The matching records are returned now sorted by relevance of ids'
    );
  });
});
