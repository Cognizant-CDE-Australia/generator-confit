'use strict';

const childProc = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const async = require('async');

const CONFIT_CMD = 'node';
const CONFIT_PARAMS = ['test/runConfit.js'];
const MOCHA_CMD = 'mocha';
const MOCHA_PARAMS = ['--reporter list', '--no-timeouts', 'test/spec/integration/*.spec.js'];

const FIXTURE_DIR = path.join(__dirname, 'fixtures/');
const TEST_DIR = path.join(__dirname, '../temp-test');
const SAMPLE_APP_MODULE_DIR = 'demoModule/';

const LABEL_CONFIT = chalk.green.underline.bold('CONFIT');
const LABEL_SUCCESS = chalk.green.bold('SUCCESS');
const LABEL_FAILED = chalk.red.bold('FAILED');
const BLACK_START = chalk.styles.bgBlack.open;
const BLACK_END = chalk.styles.bgBlack.close;

const TICK = chalk.green('\u2713');
const CROSS = chalk.red('x');


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
  var results = [];

  var runInSequence = process.argv.filter(function (arg) { return arg === '--sequence'; }).length === 1;
  var processRunner = (runInSequence) ? 'spawnSync' : 'spawn';
  var asyncMethod = (runInSequence) ? 'waterfall' : 'parallel';


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
      TEST_DIR: testDir,
      SAMPLE_APP_MODULE_DIR: SAMPLE_APP_MODULE_DIR
    });
  }


  function runMocha(fixtureDir, fixture, testDir) {
    return promiseRunner(MOCHA_CMD, MOCHA_PARAMS, {
      FIXTURE: fixture,
      FIXTURE_DIR: fixtureDir,
      TEST_DIR: testDir,
      SAMPLE_APP_MODULE_DIR: SAMPLE_APP_MODULE_DIR
    });
  }


  function processResults(code) {
    procComplete++;
    var isSuccess = (code === 0);
    procSuccess += (code === 0) ? 1 : 0;
    results.push(isSuccess ? TICK : CROSS);

    confitMsg(chalk.white('Executed spec', procComplete, 'of', procCount + '.', 'Result:'), (isSuccess ? LABEL_SUCCESS : LABEL_FAILED), results.join(''));

    if (procComplete === procCount) {
      confitMsg(chalk.white.bold('Overall Result:'), (procCount === procSuccess ? LABEL_SUCCESS : LABEL_FAILED), results.join(''), BLACK_END);
      process.exit((procCount === procSuccess) ? 0 : 1);  // Return a non-zero code for a failure
    }
  }


  function testConfitFixture(fixture) {
    confitMsg(chalk.white('Running test for'), chalk.white.bold(fixture));
    var testDir = path.join(TEST_DIR, fixture.replace('.json', ''), '/')

    // Install Confit first, wait for it to complete, then start the Mocha spec
    confitMsg(chalk.white('Running Confit generator...'));

    return runConfit(FIXTURE_DIR, fixture, testDir).then(function success() {
      confitMsg(chalk.white('... finished running Confit generator.'));

      confitMsg(chalk.white('Running Mocha for', fixture, '...'));
      return runMocha(FIXTURE_DIR, fixture, testDir);

    }).then(function success(code) { processResults(code); }, function failure(code) { processResults(code); });
  }


  async[asyncMethod](fixtures.map((fixture) => async.asyncify(function() {
    testConfitFixture(fixture);
  })));
}

/**
 * Get a list of fixture files from a directory that do NOT start with x but end with '.json'.
 * Additionally, if a fixture starts with '-' it is a 'solo' fixture... ONLY run this fixture.
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

  // get a list of the files that start with '-'. If there are any return them, otherwise return everything
  var soloFiles = files.filter(function(file) {
    return file.charAt(0) === '-';
  });

  return (soloFiles.length) ? soloFiles : files;
}


function confitMsg() {
  console.info.apply(this, ['\n', BLACK_START, LABEL_CONFIT].concat(Array.prototype.slice.call(arguments)).concat(BLACK_END));
}

main();
