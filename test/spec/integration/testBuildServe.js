'use strict';

var assert = require('assert');
var server = require('./server');
var childProc = require('child_process');
var tempTestDir = process.env.TEST_DIR;

const SERVER_MAX_WAIT_TIME = 30000;

function runBrowserTest(baseUrl) {
  console.info('Protractor baseUrl is', baseUrl);

  var proc = childProc.spawnSync('npm', ['run', 'test:browser', '--', '--baseUrl', baseUrl], {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR
  });

  if (proc.status !== 0) {
    throw new Error('' + proc.error);
  }
}


module.exports = function() {

  describe('npm run build:serve', function() {

    var baseUrl;

    before(function() {
      // Start up the confit DEV webserver
      return server.start('npm run build:serve', tempTestDir, 'serverProd', /Started connect web server on/, SERVER_MAX_WAIT_TIME).then(function success(result) {
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
