'use strict';
var assert = require('assert');
var childProc = require('child_process');
var fs = require('fs-extra');

var UNIT_TEST_CMD = 'npm run test:unit:once';
const FIXTURE_DIR = __dirname + '/fixtures/';

// Pass the confit config to this module... (use module.exports

function runCommand() {
  // If there is an error, an exception will be thrown
  childProc.execSync(UNIT_TEST_CMD, {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR
  });
}


module.exports = function(confitConfig) {

  describe('npm run test:unit:once', function() {

    it('should pass the unit tests in the sampleApp code', function() {
      assert.doesNotThrow(runCommand);
    });


    describe('with a unit test that finds a failure', function() {
      var jsFixtureFile = 'unitTest-fail.js';   // If this file is named 'unitTest-fail.spec.js', Mocha will try to run it as a unit/integration test!
      var destFixtureFile = process.env.TEST_DIR + confitConfig.paths.input.modulesDir + process.env.SAMPLE_APP_MODULE_DIR +
                            confitConfig.paths.input.unitTestDir + jsFixtureFile;

      before(function() {
        // Need to create a JS AND TypeScript version of this spec
        fs.copySync(FIXTURE_DIR + jsFixtureFile, destFixtureFile.replace('.js', '.spec.js'));
        fs.copySync(FIXTURE_DIR + jsFixtureFile, destFixtureFile.replace('.js', '.spec.ts'));
      });

      after(function() {
        fs.removeSync(destFixtureFile.replace('.js', '.spec.js'));
        fs.removeSync(destFixtureFile.replace('.js', '.spec.ts'));
      });


      it('should throw an error when a test has failed', function() {
        assert.throws(runCommand, Error);
      });
    });

  });
};
