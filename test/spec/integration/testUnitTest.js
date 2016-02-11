'use strict';
var assert = require('assert');
var childProc = require('child_process');
var fs = require('fs-extra');

var UNIT_TEST_CMD = 'npm run test:unit:once';

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
      var destFixtureFile = process.env.TEST_DIR + confitConfig.paths.input.modulesDir +
                            confitConfig.paths.input.unitTestDir + 'unitTest-fail.spec.js';

      before(function() {
        // Need to create a JS AND TypeScript version of this spec
        fs.copySync(process.env.FIXTURE_DIR + 'unitTest/unitTest-fail.spec.js', destFixtureFile);
        fs.copySync(process.env.FIXTURE_DIR + 'unitTest/unitTest-fail.spec.js', destFixtureFile.replace('.js', '.ts'));
      });

      after(function() {
        fs.removeSync(destFixtureFile);
        fs.removeSync(destFixtureFile.replace('.js', '.ts'));
      });


      it('should throw an error when a test has failed', function() {
        assert.throws(runCommand, Error);
      });
    });

  });
};
