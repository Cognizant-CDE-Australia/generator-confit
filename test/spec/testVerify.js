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


    if ((confitConfig.verify.jsLinter || []).indexOf('eslint') > -1) {
      describe('eslint', function() {
        var destFixtureFile =  process.env.TEST_DIR + confitConfig.paths.input.modulesDir + 'eslint-fail.js';

        before(function() {
          // Check the confit config. If verify.jsLinter.indexOf('eslint')
          fs.copySync(process.env.FIXTURE_DIR + 'verify/eslint-fail.js', destFixtureFile);
        });

        after(function() {
          fs.removeSync(destFixtureFile);
        });


        it('should throw an error when the code fails to lint', function() {
          assert.throws(runCommand, Error);
        });
      });
    }
  });
};
