'use strict';

module.exports = function (environment) {
  const { COVID_API, TILE_SERVER, TILE_SERVER_ATTRIBUTION } = process.env;
  const mirageEnabled = COVID_API ? false : true;
  const apiHost = COVID_API || 'https://covid19.knowledge.yahoo.com';

  const tileServer = TILE_SERVER || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileServerAttribution = TILE_SERVER ? TILE_SERVER_ATTRIBUTION : 'osmAttribution';
  let whitelistedServers;
  if (tileServer.includes('{s}')) {
    whitelistedServers = ['a', 'b', 'c'].map((server) => new URL(tileServer.replace('{s}', server)).origin);
  } else {
    whitelistedServers = [new URL(tileServer).origin];
  }

  let ENV = {
    modulePrefix: 'covid-19-dashboard',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      host: apiHost,
      namespace: '/api/json/v1',
      tileServer,
      tileServerAttribution,
    },
    'ember-metrics': {
      includeAdapters: ['google-analytics'],
    },
    metricsAdapters: [
      {
        name: 'covid-ga',
        environments: ['development', 'production'],
        config: {
          id: 'UA-86392702-3',

          // Use `analytics_debug.js` in development
          debug: environment === 'development',
          // Use verbose tracing of GA events
          trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development',
          // Specify Google Analytics plugins
          require: [],
        },
      },
    ],
    'ember-cli-mirage': {
      enabled: mirageEnabled, // Set to false to use real data
    },
    contentSecurityPolicy: {
      'default-src': ["'none'"], // Deny everything by default
      'script-src': ["'self'", 'www.google-analytics.com'],
      'font-src': ["'self'"],
      'connect-src': ["'self'", 'www.google-analytics.com', apiHost],
      'img-src': ["'self'", ...whitelistedServers, 'https://s.yimg.com', 'data:'],
      'style-src': ["'self' 'unsafe-inline'"],
      'media-src': null, // Browser will fallback to default-src for media resources (which is 'none', see above)
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV['ember-cli-mirage'] = {
      enabled: false, //never change me
    };
    ENV.rootURL = '/covid-19-dashboard/';
  }

  return ENV;
};
