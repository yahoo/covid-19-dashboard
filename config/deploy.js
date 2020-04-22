/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV.sftp = {
      host: process.env.DEPLOY_HOST,
      remoteDir: process.env.DEPLOY_DIR,
      remoteUser: process.env.DEPLOY_USER,
      privateKey: process.env.DEPLOY_KEY,
      passphrase: process.env.DEPLOY_PASSPHRASE,
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
