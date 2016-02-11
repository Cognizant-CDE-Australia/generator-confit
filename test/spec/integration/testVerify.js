'use strict';
var assert = require('assert');
var childProc = require('child_process');
var fs = require('fs-extra');

var VERIFY_CMD = 'npm run verify';

// Pass the confit config to this module... (use module.exports

function runCommand() {
  // If there is an error, an exception will be thrown
  childProc.execSync(VERIFY_CMD, {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR
  });
}


module.exports = function(confitConfig) {

  describe('npm run verify', function() {

    it('should not find errors in the sampleApp code', function() {
      assert.doesNotThrow(runCommand);
    });


    if (confitConfig.verify.jsCodingStandard !== 'none') {
      describe('JS Coding Standards', function() {
        var destFixtureFile =  process.env.TEST_DIR + confitConfig.paths.input.modulesDir + 'js-syntax-fail.js';

        before(function() {
          fs.copySync(process.env.FIXTURE_DIR + 'verify/js-syntax-fail.js', destFixtureFile);
          fs.copySync(process.env.FIXTURE_DIR + 'verify/js-syntax-fail.js', destFixtureFile.replace('.js', '.ts'));
        });

        after(function() {
          fs.removeSync(destFixtureFile);
          fs.removeSync(destFixtureFile.replace('.js', '.ts'));
        });


        it('should throw an error when the code fails to lint', function() {
          assert.throws(runCommand, Error);
        });
      });
    }
  });
};
