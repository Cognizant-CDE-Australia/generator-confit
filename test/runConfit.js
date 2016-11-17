'use strict';

const helpers = require('yeoman-test');
const path = require('path');
const fs = require('fs-extra');
const assert = require('assert');
const _ = require('lodash');
const yaml = require('js-yaml');

// Global data
const CONFIT_FILE_NAME = 'confit.yml';
const GENERATOR_PATH = path.join(__dirname, '../lib/generators/');

let testDirName = process.env.TEST_DIR;
let srcFixtureFile = path.join(process.env.FIXTURE_DIR, process.env.FIXTURE);
let useExistingNodeModules = true;    // Try to preserve node_modules between test runs
let cleanTestDir = !(useExistingNodeModules || true);

runGenerator();

/**
 * Runs the confit:app generator
 *
 * @param {String} testDir                Where to run the generator
 * @param {String} srcConfitFilename      The path to the fixture file, which is copied to the testDir
 * @param {String} useExistingNodeModules Boolean to indicate whether to try to re-use any existing node_modules directory (default: true)
 * @return {Promise}             Promise
 */
function runGenerator() {
  return new Promise(install);
}

/**
 * Installs Confit
 * @param {Function} resolve  Function to call when installation succeeds
 * @param {Function} reject   Function to call when installation fails
 */
function install(resolve, reject) {
  let destConfitConfigPath = path.join(testDirName, CONFIT_FILE_NAME);
  let previousCWD = process.cwd();  // Remember this, so we can return to this directory later

  // This turns off the "May <packageName> ... insights?" prompt. See https://github.com/yeoman/insight/blob/master/lib/index.js#L106
  process.env.CI = true;

  try {
    // Clean directory (use cleanTestDir flag) to determine how-much to clean (everything, or only some files)
    clean(testDirName, cleanTestDir);

    // Change into the test directory, to execute the generator
    process.chdir(testDirName);

    // Copy the fixture to the temporary directory
    fs.copySync(srcFixtureFile, destConfitConfigPath);

    // Determine whether we need to run the installer or not (compare confit.yml.previous to confit.yml)
    let skipInstall = isConfigIdentical(destConfitConfigPath);

    // Run the generator
    let generatorName = path.join(GENERATOR_PATH, 'app');

    // Need to update this every time there is a brand new confit:* generator, or you will get an error like this:
    // "You don't seem to have a generator with the name <generator-name> installed"
    helpers.run(generatorName, {tmpdir: false})   // Don't clean (or create) a temporary directory, as we want to handle this ourselves (above)
      .withArguments(['--force=true'])    // Any file-conflicts, over-write
      .withGenerators([
        path.join(GENERATOR_PATH, 'buildAssets'),
        path.join(GENERATOR_PATH, 'buildBrowser'),
        path.join(GENERATOR_PATH, 'buildCSS'),
        path.join(GENERATOR_PATH, 'buildHTML'),
        path.join(GENERATOR_PATH, 'buildJS'),
        path.join(GENERATOR_PATH, 'documentation'),
        path.join(GENERATOR_PATH, 'entryPoint'),
        path.join(GENERATOR_PATH, 'paths'),
        path.join(GENERATOR_PATH, 'release'),
        path.join(GENERATOR_PATH, 'sampleApp'),
        path.join(GENERATOR_PATH, 'serverDev'),
        path.join(GENERATOR_PATH, 'serverProd'),
        path.join(GENERATOR_PATH, 'testSystem'),
        path.join(GENERATOR_PATH, 'testUnit'),
        path.join(GENERATOR_PATH, 'testVisualRegression'),
        path.join(GENERATOR_PATH, 'verify'),
        path.join(GENERATOR_PATH, 'zzfinish'),
      ])
      .withOptions({
        configFile: CONFIT_FILE_NAME,
        skipInstall: skipInstall,     // Can only skip if the old confit file is identical to the new file
        skipRun: true,
      })
      .withPrompts({
        rebuildFromConfig: true,
        createSampleApp: true,
      })
      .on('error', function(err) {
        console.error('generator error', err);
        assert.ifError(err);
      })
      .on('end', function() {
        let config = yaml.load(fs.readFileSync(destConfitConfigPath))['generator-confit'];

        // Create a confit.yml.previous file, to help us speed up installation next time.
        // Next run, look for this file. If it exists, don't do an install
        fs.copySync(destConfitConfigPath, destConfitConfigPath + '.previous');
        process.chdir(previousCWD);
        resolve(config);
      });
  } catch (err) {
    process.chdir(previousCWD);
    console.log(err);
    reject(err);
  }
}

/**
 * Removes all files and directories
 * @param {string} dir                Directory to clean
 * @param {Boolean} cleanEverything   If true, removes everything. If false, keeps node_modules/ and confit.yml.previous.
 */
function clean(dir, cleanEverything) {
  fs.ensureDirSync(dir);

  if (cleanEverything) {
    fs.emptyDirSync(dir);
  } else {
    // Keep the node_modules directory and CONFIT_FILE_NAME + .previous
    let files = fs.readdirSync(dir).filter((file) => file !== 'node_modules' && file !== CONFIT_FILE_NAME + '.previous');

    // console.log('Deleting:', files.join('\n'));
    files.forEach(function(file) {
      fs.removeSync(path.join(dir, file));
    });
  }
}

/**
 * Returns true if both configs are identical
 * @param {string} newConfigName    Name of the new config file
 * @return {Boolean}                True if the newConfigName is identical to the previous config
 */
function isConfigIdentical(newConfigName) {
  let oldConfigName = newConfigName + '.previous';

  try {
    fs.statSync(oldConfigName).isFile();    // Produces an error if the file does not exist
  } catch (err) {
    return false;
  }

  return _.isEqual(fs.readFileSync(oldConfigName), fs.readFileSync(newConfigName));
}
