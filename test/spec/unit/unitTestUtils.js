'use strict';

const path = require('path');
const assert = require('assert');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const MAX_LOG = process.argv.indexOf('--MAX_LOG=true') > -1;

module.exports = {
  noop: () => {},
  runGenerator: runGenerator,
};

/**
 * Runs the generator
 *
 * @param {String} generatorName    The name of the generator to run
 * @param {String} confitFixture    The name of the initial confit fixture
 * @param {Function} beforeTestCb   Function to run before generator
 * @param {Function} afterCb        Function to run after generator (contains expectations)
 * @param {Function} errorCb        Function to run on error
 * @return {GeneratorHelper}       The GeneratorHelper instance, to allow further function calls.
 */
function runGenerator(generatorName, confitFixture, beforeTestCb, afterCb, errorCb) {
  let generatorFullName = path.join(__dirname, '../../../lib/generators/' + generatorName);
  let testDir;

  try {
    return helpers.run(generatorFullName)
      .inTmpDir(function(dir) {
        // Copy the confit.json fixture here
        if (confitFixture) {
          let confitExt = path.extname(confitFixture);

          fs.copySync(path.join(__dirname, 'fixtures/', confitFixture), path.join(dir, 'confit' + confitExt));
        }
        if (MAX_LOG) {
          console.log('testdir', dir);
        }
        testDir = dir;
        try {
          beforeTestCb(testDir);
        } catch (e) {
          console.error('generator before handler exception', e);
        }
      })
      .withArguments(['--force=true'])    // Any file-conflicts, over-write
      .withOptions({
        skipInstall: true,
        skipRun: true,
      })
      .on('ready', function() {
        if (MAX_LOG) {
          console.log('generator ready');
        }
      })
      .on('error', function(err) {
        if (errorCb) {
          try {
            errorCb(err);
          } catch (e) {
            console.error('generator error handler exception', e);
          }
        } else {
          console.error('generator error', err);
          assert.ifError(err);
        }
      })
      .on('end', function() {
        if (MAX_LOG) {
          console.error('generator end');
        }
        try {
          afterCb(testDir);
        } catch (e) {
          console.error('generator after handler exception', e);
        }
      });
  } catch (e) {
    if (MAX_LOG) {
      console.log('generator exception');
    }
    console.error(e);
  }
}
