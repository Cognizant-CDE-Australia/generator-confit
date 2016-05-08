'use strict';

const assert = require('assert');
const server = require('./server');
const childProc = require('child_process');
const tempTestDir = process.env.TEST_DIR;

function runBrowserTest(baseUrl) {
  console.info('Protractor baseUrl is', baseUrl);

  let proc = childProc.spawnSync('npm', ['run', 'test:browser', '--', '--baseUrl', baseUrl], {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR
  });

  if (proc.status !== 0) {
    throw new Error('' + proc.error);
  }
}


module.exports = function(confitConfig, SERVER_MAX_WAIT_TIME) {

  describe('npm run dev', function() {

    let baseUrl;

    before(function() {
      // Start up the confit DEV webserver
      return server.start('npm start', tempTestDir, 'serverDev', /webpack: bundle is now VALID\.\n$/, SERVER_MAX_WAIT_TIME).then(function success(result) {
        baseUrl = result.baseUrl;
      });
    });

    it('should start a webserver and build the sampleApp correctly', function() {
      assert.doesNotThrow(function () { runBrowserTest(baseUrl); });
    });

    after(function() {
      server.stop();
    });
  });
};
