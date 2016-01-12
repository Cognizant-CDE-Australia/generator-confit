'use strict';

var childProc = require('child_process');
var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
require('colors');

var CMD = 'node_modules/.bin/mocha';
var CMD_PARAMS = ['--reporter list', '--no-timeouts', '--delay', 'test/spec/confit.spec.js'];
var FIXTURE_PATH = path.join(__dirname, 'fixtures/');
var TEST_DIR = path.join(__dirname, '../temp-test');


/**
 * Allow the test runner to run tests in series (helpful for debugging) or in parallel.
 *
 * node testRunner.js [--sequence]
 */
function main() {
  var fixtures = getFixtures(FIXTURE_PATH);
  var procCount = 0;
  var procComplete = 0;
  var procSuccess = 0;

  var runInSequence = process.argv.filter(function (arg) { return arg === '--sequence'; }).length === 1;
  var processRunner = (runInSequence) ? 'spawnSync' : 'spawn';


  function processResults(code) {
    procComplete++;
    var isSuccess = (code === 0);
    procSuccess += (code === 0) ? 1 : 0;
    console.info('\n' + ('CONFIT'.green.underline + (': Executed ' + procComplete + ' of ' + procCount + ' specs ').white + (isSuccess ? 'SUCCESS'.green.bold : 'FAILED'.red.bold)).bgBlack);

    if (procComplete === procCount) {
      console.info('\n' + ('CONFIT Test Result:'.green.underline + ' ' + (procCount === procSuccess ? 'SUCCESS'.green.bold : 'FAILED'.red.bold)).bgBlack);
      process.exit(0);
    }
  }

  // Now, for each fixture file, run the command
  fixtures.forEach(function(fixture) {
    console.info('\n' + ('CONFIT: '.bold + 'Running test for ' + fixture.bold).green.underline.bgBlack);
    var proc = childProc[processRunner](CMD, CMD_PARAMS, {
      stdio: 'inherit',    // send the child console output to the parent process (us)
      // Mocha / everyone needs the entire process.env, so let's just extend it rather than replace it
      env: _.merge({}, process.env, {
        FIXTURE: fixture,
        FIXTURE_DIR: FIXTURE_PATH,
        TEST_DIR: path.join(TEST_DIR, fixture.replace('.json', ''), '/')
      })
    });

    if (!runInSequence) {
      procCount++;
      proc.on('close', processResults);
    } else {
      procCount = fixtures.length;  // A fixed value
      processResults(proc.status);
    }
  });
}

/**
 * Get a list of fixture files from a directory that do NOT start with x but end with '.json'
 *
 * @param dir                 The directory to search
 * @returns {Array.<String>}  The list of files found that match the criteria
 */
function getFixtures(dir) {
  // Get a list of files that end in '.json' from the directory, that do not start with 'x'
  var files = fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isFile() && (file.match(/^[^x]+\.json$/) !== null);
    });
  return files;
}


main();
