import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import ENV from 'covid-19-dashboard/config/environment';

let OriginalEnvironment, OriginalMaintenanceMode;

module('Acceptance | maintenance mode', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    OriginalEnvironment = ENV.environment;
    OriginalMaintenanceMode = ENV.APP.maintenanceMode;
  });

  hooks.afterEach(function () {
    ENV.environment = OriginalEnvironment;
    ENV.APP.maintenanceMode = OriginalMaintenanceMode;
  });

  test('"test" environment, maintenanceMode = false', async function (assert) {
    ENV.environment = 'test';
    ENV.APP.maintenanceMode = false;

    await visit('/');
    assert.strictEqual(currentURL(), '/Earth', 'index does not redirect');

    await visit('/Illinois');
    assert.strictEqual(currentURL(), '/Illinois', 'Direct location does not redirect');

    await visit('/maintenance');
    assert.strictEqual(currentURL(), '/Earth', 'It redirects out of maintenance mode');
  });

  test('"development" environment, maintenanceMode = false', async function (assert) {
    ENV.environment = 'development';
    ENV.APP.maintenanceMode = false;

    await visit('/');
    assert.strictEqual(currentURL(), '/Earth', 'index does not redirect');

    await visit('/Illinois');
    assert.strictEqual(currentURL(), '/Illinois', 'Direct location does not redirect');

    await visit('/maintenance');
    assert.strictEqual(currentURL(), '/Earth', 'It redirects out of maintenance mode');
  });

  test('"production" environment, maintenanceMode = false', async function (assert) {
    ENV.environment = 'production';
    ENV.APP.maintenanceMode = false;

    await visit('/');
    assert.strictEqual(currentURL(), '/Earth', 'index does not redirect');

    await visit('/Illinois');
    assert.strictEqual(currentURL(), '/Illinois', 'Direct location does not redirect');

    await visit('/maintenance');
    assert.strictEqual(currentURL(), '/Earth', 'It redirects out of maintenance mode');
  });

  test('"test" environment, maintenanceMode = true', async function (assert) {
    ENV.environment = 'test';
    ENV.APP.maintenanceMode = true;

    await visit('/');
    assert.strictEqual(currentURL(), '/Earth', 'index does not redirect in maintenanceMode');

    await visit('/Illinois');
    assert.strictEqual(currentURL(), '/Illinois', 'Direct location does not redirect in maintenanceMode');

    await visit('/maintenance');
    assert.strictEqual(currentURL(), '/maintenance', 'It stays in maintenance mode');
  });

  test('"development" environment, maintenanceMode = true', async function (assert) {
    ENV.environment = 'development';
    ENV.APP.maintenanceMode = true;

    await visit('/');
    assert.strictEqual(currentURL(), '/maintenance', 'index redirects in maintenanceMode');

    await visit('/Illinois');
    assert.strictEqual(currentURL(), '/maintenance', 'Direct location redirects in maintenanceMode');

    await visit('/maintenance');
    assert.strictEqual(currentURL(), '/maintenance', 'It stays in maintenance mode');
  });

  test('"production" environment, maintenanceMode = true', async function (assert) {
    ENV.environment = 'production';
    ENV.APP.maintenanceMode = true;

    await visit('/');
    assert.strictEqual(currentURL(), '/maintenance', 'index redirects in maintenanceMode');

    await visit('/Illinois');
    assert.strictEqual(currentURL(), '/maintenance', 'Direct location redirects in maintenanceMode');

    await visit('/maintenance');
    assert.strictEqual(currentURL(), '/maintenance', 'It stays in maintenance mode');
  });
});
