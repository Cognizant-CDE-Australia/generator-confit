'use strict';

var helpers = require('yeoman-test');
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');

// Global data
var testDirName = '';
var srcFixtureFile = '';
var cleanTestDir = false;
var CONFIT_FILE_NAME = 'confit.json';


/**
 * Runs the confit:app generator
 *
 * @param testDir                Where to run the generator
 * @param srcConfitFilename      The path to the fixture file, which is copied to the testDir
 * @param useExistingNodeModules Boolean to indicate whether to try to re-use any existing node_modules directory (default: true)
 * @returns {Promise}
 */
function runGenerator(testDir, srcConfitFilename, useExistingNodeModules) {
  testDirName = testDir;
  srcFixtureFile = srcConfitFilename;
  cleanTestDir = !(useExistingNodeModules || true);

  return new Promise(install);
}



function install(resolve, reject) {
  var destConfitConfigPath = path.join(testDirName, CONFIT_FILE_NAME);
  var previousCWD = process.cwd();  // Remember this, so we can return to this directory later

  // This turns off the "May <packageName> ... insights?" prompt. See https://github.com/yeoman/insight/blob/master/lib/index.js#L106
  process.env.CI = true;

  try {
    // Clean directory (use cleanTestDir flag) to determine how-much to clean (everything, or only some files)
    clean(testDirName, cleanTestDir);

    // Change into the test directory, to execute the generator
    process.chdir(testDirName);

    // Copy the fixture to the temporary directory
    fs.copySync(srcFixtureFile, destConfitConfigPath);

    // Determine whether we need to run the installer or not (compare confit.json.previous to confit.json)
    var skipInstall = isConfigIdentical(destConfitConfigPath);

    // Run the generator
    var generatorName = path.join(__dirname, '../generators/app');
    helpers.run(generatorName, {tmpdir: false})   // Don't clean (or create) a temporary directory, as we want to handle this ourselves (above)
      .withArguments(['--force=true'])    // Any file-conflicts, over-write
      .withGenerators([
        path.join(__dirname, '../generators/build'),
        path.join(__dirname, '../generators/buildAssets'),
        path.join(__dirname, '../generators/buildCSS'),
        path.join(__dirname, '../generators/buildHTML'),
        path.join(__dirname, '../generators/buildJS'),
        path.join(__dirname, '../generators/entryPoint'),
        path.join(__dirname, '../generators/paths'),
        path.join(__dirname, '../generators/sampleApp'),
        path.join(__dirname, '../generators/serverDev'),
        path.join(__dirname, '../generators/serverProd'),
        path.join(__dirname, '../generators/verify'),
        path.join(__dirname, '../generators/zzfinish')
      ])
      .withOptions({
        configFile: CONFIT_FILE_NAME,
        skipInstall: skipInstall,     // Can only skip if the old confit file is identical to the new file
        skipRun: true
      })
      .withPrompts({
        rebuildFromConfig: true,
        createScaffoldProject: true
      })
      .on('end', function() {
        var config = require(destConfitConfigPath)['generator-confit'];
        var server = config.serverDev;

        var result = {
          baseUrl: [server.protocol, '://', server.hostname, ':', server.port].join('')
        };

        // Create a confit.json.previous file, to help us speed up installation next time.
        // Next run, look for this file. If it exists, don't do an install
        fs.copySync(destConfitConfigPath, destConfitConfigPath + '.previous');
        process.chdir(previousCWD);
        resolve(result);
      });

  } catch(err) {
    process.chdir(previousCWD);
    reject(err);
  }
}


function clean(dir, cleanEverything) {

  fs.ensureDirSync(dir);

  if (cleanEverything) {
    fs.emptyDirSync(dir);
  } else {
    // Keep the node_modules directory and CONFIT_FILE_NAME + .previous
    var files = fs.readdirSync(dir)
      .filter(function(file) {
        return (file !== 'node_modules' && file !== CONFIT_FILE_NAME + '.previous');
      });

    //console.log('Deleting:', files.join('\n'));
    files.forEach(function(file) {
      fs.removeSync(path.join(dir, file));
    });
  }
}


function isConfigIdentical(newConfigName) {
  var oldConfigName = newConfigName + '.previous'

  try {
    fs.statSync(oldConfigName).isFile();    // Produces an error if the file does not exist
  } catch(err) {
    return false;
  }

  return _.isEqual(fs.readJsonSync(oldConfigName), fs.readJsonSync(newConfigName));
}


module.exports = {
  run: runGenerator
};
