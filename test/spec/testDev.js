'use strict';

var assert = require('assert');
var server = require('./../server');
var childProc = require('child_process');
var tempTestDir = process.env.TEST_DIR;


var CMD = 'protractor';
var CMD_PARAMS = ['test/protractor.conf.js'];


function runProtractor(baseUrl) {
  console.info('Protractor baseUrl is', baseUrl);

  // If there is an error, an exception will be thrown
  var proc = childProc.spawnSync(CMD, CMD_PARAMS.concat(['--baseUrl', baseUrl]), {
    stdio: 'inherit'
  });

  if (proc.status !== 0) {
    throw new Error('' + proc.error);
  }
}


module.exports = function() {

  describe('npm run dev', function() {

    var baseUrl;

    before(function() {
      // Start up the confit DEV webserver
      return server.start(tempTestDir, 'serverDev', 10000).then(function success(result) {
        baseUrl = result.baseUrl;
      });
    });

    it('should start a webserver and build the sampleApp correctly', function() {
      assert.doesNotThrow(function() {runProtractor(baseUrl);});
    });

    after(function() {
      server.stop();
    });
  });
};
