'use strict';
const assert = require('assert');
const childProc = require('child_process');
const fs = require('fs-extra');

const VERIFY_CMD = 'npm run verify';
const FIXTURE_DIR = __dirname + '/fixtures/';

// Pass the confit config to this module... (use module.exports

function runCommand() {
  // If there is an error, an exception will be thrown
  childProc.execSync(VERIFY_CMD, {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR
  });
}


module.exports = function(confitConfig, srcDir) {

  describe('npm run verify', () => {

    it('should not find errors in the sampleApp code', function() {
      assert.doesNotThrow(runCommand);
    });


    if (confitConfig.verify.jsCodingStandard !== 'none') {
      describe('- JS Coding Standards', () => {
        let jsFixtureFile = 'js-syntax-fail.js';
        let destFixtureFile =  srcDir + jsFixtureFile;

        before(function() {
          fs.copySync(FIXTURE_DIR + jsFixtureFile, destFixtureFile);
          fs.copySync(FIXTURE_DIR + jsFixtureFile, destFixtureFile.replace('.js', '.ts'));
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

    if (confitConfig.buildCSS && confitConfig.buildCSS.sourceFormat !== 'css') {
      describe('- CSS Linting', function() {
        var cssFixtureFile = 'css-lint-fail.css';
        var destFixtureFile =  process.env.TEST_DIR + confitConfig.paths.input.modulesDir + process.env.SAMPLE_APP_MODULE_DIR +
                               confitConfig.paths.input.stylesDir + cssFixtureFile;

        before(function() {
          fs.copySync(FIXTURE_DIR + cssFixtureFile, destFixtureFile);
          fs.copySync(FIXTURE_DIR + cssFixtureFile, destFixtureFile.replace('.css', '.styl'));
          fs.copySync(FIXTURE_DIR + cssFixtureFile, destFixtureFile.replace('.css', '.sass'));
        });

        after(function() {
          fs.removeSync(destFixtureFile);
          fs.removeSync(destFixtureFile.replace('.css', '.styl'));
          fs.removeSync(destFixtureFile.replace('.css', '.sass'));
        });


        it('should throw an error when the code fails to lint', function() {
          assert.throws(runCommand, Error);
        });
      });
    }
  });
};
