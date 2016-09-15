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

const MAX_LOG = process.argv.indexOf('--MAX_LOG=true') > -1;
const TEST_SUITE_M_OF_N = process.env.TEST_SUITE_M_OF_N;


/**
 * Allow the test runner to run tests in series (helpful for debugging) or in parallel.
 *
 * node testRunner.js [--sequence]
 */
function main() {
  let fixtures = getFixtures(FIXTURE_DIR);
  let procCount = fixtures.length;
  let procComplete = 0;
  let procSuccess = 0;
  let results = [];

  let runInSequence = process.argv.filter(arg => arg === '--sequence').length === 1;
  let processRunner = runInSequence ? 'spawnSync' : 'spawn';
  let asyncMethod = runInSequence ? 'waterfall' : 'parallel';

  /**
   * Runs a command
   * @param {string} cmd        Command to run
   * @param {string} cmdParams  Parameters for the command
   * @param {Object} envData    Environment variables to apply to the command's process
   * @return {Promise}         Promise that will resolve when command completes/exits
   */
  function promiseRunner(cmd, cmdParams, envData) {
    return new Promise(function(resolve, reject) {
      let proc = childProc[processRunner](cmd, cmdParams, {
        stdio: 'inherit',    // send the child console output to the parent process (us)
        // Mocha / everyone needs the entire process.env, so let's just extend it rather than replace it
        env: _.merge({}, process.env, envData)
      });

      if (runInSequence) {
        proc.status === 0 ? resolve(proc.status) : reject(proc.status);
      } else {
        proc.on('close', function(code) {
          code === 0 ? resolve(code) : reject(code);
        });
      }
    });
  }

  /**
   * Runs Confit
   * @param {string} fixtureDir   Fixture directory
   * @param {string} fixture      Fixture file name
   * @param {string} testDir      Test directory
   * @return {Promise}           Promise that will resolve when command completes/exits
   */
  function runConfit(fixtureDir, fixture, testDir) {
    return promiseRunner(CONFIT_CMD, CONFIT_PARAMS, {
      FIXTURE: fixture,
      FIXTURE_DIR: fixtureDir,
      TEST_DIR: testDir,
      SAMPLE_APP_MODULE_DIR: SAMPLE_APP_MODULE_DIR,
      MAX_LOG: MAX_LOG
    });
  }

  /**
   * Runs Mocha
   * @param {stiring} fixtureDir  Fixture directory
   * @param {string} fixture      Fixture file name
   * @param {string} testDir      Test directory
   * @return {Promise}           Promise that will resolve when command completes/exits
   */
  function runMocha(fixtureDir, fixture, testDir) {
    return promiseRunner(MOCHA_CMD, MOCHA_PARAMS, {
      FIXTURE: fixture,
      FIXTURE_DIR: fixtureDir,
      TEST_DIR: testDir,
      SAMPLE_APP_MODULE_DIR: SAMPLE_APP_MODULE_DIR,
      MAX_LOG: MAX_LOG
    });
  }


  /**
   * Determines whether the test ended successfully or not
   * @param {number} code   Exit code from the process
   */
  function processResults(code) {
    let isSuccess = code === 0;

    procComplete++;
    procSuccess += code === 0 ? 1 : 0;
    results.push(isSuccess ? TICK : CROSS);

    confitMsg(chalk.white('Executed spec', procComplete, 'of', procCount + '.', 'Result:'), isSuccess ? LABEL_SUCCESS : LABEL_FAILED, results.join(''));

    if (procComplete === procCount) {
      confitMsg(chalk.white.bold('Overall Result:'), procCount === procSuccess ? LABEL_SUCCESS : LABEL_FAILED, results.join(''), BLACK_END);
      process.exit(procCount === procSuccess ? 0 : 1);  // Return a non-zero code for a failure
    }
  }

  /**
   * Executes Confit with a test fixture
   * @param {string} fixture    Fixture file name
   * @return {Promise}         Promise that will resolve when command completes/exits
   */
  function testConfitFixture(fixture) {
    confitMsg(chalk.white('Running test for'), chalk.white.bold(fixture));
    let testDir = path.join(TEST_DIR, fixture.replace('.yml', ''), '/');

    // Install Confit first, wait for it to complete, then start the Mocha spec
    confitMsg(chalk.white('Running Confit generator...'));

    return runConfit(FIXTURE_DIR, fixture, testDir).then(
      function success() {
        confitMsg(chalk.white('... finished running Confit generator.'));

        confitMsg(chalk.white('Running Mocha for', fixture, '...'));
        return runMocha(FIXTURE_DIR, fixture, testDir);
      }
    ).then(
      function success(code) {
        processResults(code);
      },
      function failure(code) {
        processResults(code);
      }
    );
  }


  async[asyncMethod](fixtures.map(fixture => async.asyncify(function() {
    testConfitFixture(fixture);
  })));
}

/**
 * Get a list of fixture files from a directory that do NOT start with x but end with '.yml'.
 * Additionally, if a fixture starts with '-' it is a 'solo' fixture... ONLY run this fixture.
 *
 * @param {String} dir        The directory to search
 * @return {Array.<String>}   The list of files found that match the criteria
 */
function getFixtures(dir) {
  // Get a list of files that end in '.yml' from the directory, that do not start with 'x'
  let files = fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isFile() && file.match(/^[^x]+\.yml$/) !== null);

  // Check if there is TEST_SUITE variable. If so, use it instead
  if (TEST_SUITE_M_OF_N) {
    let parts = TEST_SUITE_M_OF_N.split('-').map(n => Number(n));
    let suiteNum = parts[0];
    let totalSuites = parts[1];
    let chunk = chunkify(files, totalSuites)[suiteNum - 1];

    console.info(chalk.white.bold('Using test fixtures:\n-', chunk.join('\n- ')));
    return chunk;
  }

  // get a list of the files that start with '-'. If there are any return them, otherwise return everything
  let soloFiles = files.filter(file => file.charAt(0) === '-');

  return soloFiles.length ? soloFiles : files;
}

/**
 * Displays a Confit message to the console
 */
function confitMsg() {
  console.info.apply(null, ['\n', BLACK_START, LABEL_CONFIT].concat(Array.prototype.slice.call(arguments)).concat(BLACK_END));
}

/**
 * Splits an array into a number of chunks
 * Copied from: http://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
 *
 * @param {Array} a           Source array
 * @param {Number} n          Number of chunks to create
 * @param {boolean} balanced  Whether to have the chunks balanced or not
 * @return {Array}           An array of arrays, broken up into "n" chunks
 */
function chunkify(a, n, balanced) {
  if (n < 2) {
    return [a];
  }

  let len = a.length;
  let out = [];
  let i = 0;
  let size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) {
      size--;
    }
    while (i < size * n) {
      out.push(a.slice(i, i += size));
    }
    out.push(a.slice(size * n));
  }

  return out;
}


main();
