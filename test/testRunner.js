'use strict';

var childProc = require('child_process');
var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var chalk = require('chalk');

var CONFIT_CMD = 'node';
var CONFIT_PARAMS = ['test/runConfit.js'];
var MOCHA_CMD = 'mocha';
var MOCHA_PARAMS = ['--reporter list', '--no-timeouts', 'test/spec/confit.spec.js'];

var FIXTURE_DIR = path.join(__dirname, 'fixtures/');
var TEST_DIR = path.join(__dirname, '../temp-test');

var LABEL_CONFIT = chalk.green.underline.bold('CONFIT');
var LABEL_SUCCESS = chalk.green.bold('SUCCESS');
var LABEL_FAILED = chalk.red.bold('FAILED');
var BLACK_START = chalk.styles.bgBlack.open;
var BLACK_END = chalk.styles.bgBlack.close;



/**
 * Allow the test runner to run tests in series (helpful for debugging) or in parallel.
 *
 * node testRunner.js [--sequence]
 */
function main() {
  var fixtures = getFixtures(FIXTURE_DIR);
  var procCount = fixtures.length;
  var procComplete = 0;
  var procSuccess = 0;

  var runInSequence = process.argv.filter(function (arg) { return arg === '--sequence'; }).length === 1;
  var processRunner = (runInSequence) ? 'spawnSync' : 'spawn';


  function promiseRunner(cmd, cmdParams, envData) {
    return new Promise(function(resolve, reject) {

      var proc = childProc[processRunner](cmd, cmdParams, {
        stdio: 'inherit',    // send the child console output to the parent process (us)
        // Mocha / everyone needs the entire process.env, so let's just extend it rather than replace it
        env: _.merge({}, process.env, envData)
      });

      if (runInSequence) {
        (proc.status === 0) ? resolve(proc.status) : reject(proc.status);
      } else {
        proc.on('close', function(code) {
          (code === 0) ? resolve(code) : reject(code);
        });
      }
    });
  }

  function runConfit(fixtureDir, fixture, testDir) {
    return promiseRunner(CONFIT_CMD, CONFIT_PARAMS, {
      FIXTURE: fixture,
      FIXTURE_DIR: fixtureDir,
      TEST_DIR: testDir
    });
  }


  function runMocha(fixtureDir, fixture, testDir) {
    return promiseRunner(MOCHA_CMD, MOCHA_PARAMS, {
      FIXTURE: fixture,
      FIXTURE_DIR: fixtureDir,
      TEST_DIR: testDir
    });
  }


  function processResults(code) {
    procComplete++;
    var isSuccess = (code === 0);
    procSuccess += (code === 0) ? 1 : 0;

    confitMsg(chalk.white('Executed spec', procComplete, 'of', procCount, '. Result:'), (isSuccess ? LABEL_SUCCESS : LABEL_FAILED));

    if (procComplete === procCount) {
      confitMsg(chalk.white.bold('Overall Result:'), (procCount === procSuccess ? LABEL_SUCCESS : LABEL_FAILED), BLACK_END);
      process.exit((procCount === procSuccess) ? 0 : 1);  // Return a non-zero code for a failure
    }
  }

  // Now, for each fixture file, run the command(s)
  fixtures.forEach(function(fixture) {
    confitMsg(chalk.white('Running test for'), chalk.white.bold(fixture));
    var testDir = path.join(TEST_DIR, fixture.replace('.json', ''), '/')

    // Install Confit first, wait for it to complete, then start the Mocha spec
    confitMsg(chalk.white('Running Confit generator...'));

    runConfit(FIXTURE_DIR, fixture, testDir).then(function success() {
      confitMsg(chalk.white('... finished running Confit generator.'));

      confitMsg(chalk.white('Running Mocha for', fixture, '...'));
      return runMocha(FIXTURE_DIR, fixture, testDir);

    }).then(function success(code) { processResults(code); }, function failure(code) { processResults(code); });
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


function confitMsg() {
  console.info.apply(this, ['\n', BLACK_START, LABEL_CONFIT].concat(Array.prototype.slice.call(arguments)).concat(BLACK_END));
}

main();
