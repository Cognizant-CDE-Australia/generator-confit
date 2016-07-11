'use strict';

const path = require('path');
const helpers = require('yeoman-test');
const fs = require('fs-extra');
const MAX_LOG = process.argv.indexOf('--MAX_LOG=true') > -1;

module.exports = {
  noop: () => {},
  runGenerator: runGenerator
};

function runGenerator(generatorName, confitFixture, beforeTestCb, afterCb, errorCb) {
  var generatorName = path.join(__dirname, '../../../lib/generators/' + generatorName);
  var testDir;

  try {
    return helpers.run(generatorName)
      .inTmpDir(function(dir) {
        // Copy the confit.json fixture here
        if (confitFixture) {
          fs.copySync(path.join(__dirname, 'fixtures/', confitFixture), path.join(dir, 'confit.json'));
        }
        if (MAX_LOG) {
          console.log('testdir', dir);
        }
        testDir = dir;
        try {
          beforeTestCb(testDir);
        } catch(e) {
          console.error('generator before handler exception', e);
        }
      })
      .withArguments(['--force=true'])    // Any file-conflicts, over-write
      .withOptions({
        skipInstall: true,
        skipRun: true
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
        } catch(e) {
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
