'use strict';

var helpers = require('yeoman-test');
var path = require('path');
var fs = require('fs-extra');

// Global data
var testDirName = '';
var srcFixtureFile = '';
var destFixtureFile = 'confit.json';
var TEMP_NODE_MODULE_DIRNAME = '.test_node_modules';


function install(resolve, reject) {
  var testDir = path.join(__dirname, '../' + testDirName);
  var destConfitConfigPath = path.join(testDir, destFixtureFile);
  var srcNodeModuleDir = path.join(__dirname, '../', TEMP_NODE_MODULE_DIRNAME);
  var destNodeModuleDir = path.join(testDir, 'node_modules');

  // This turns off the "May <packageName> ... insights?" prompt. See https://github.com/yeoman/insight/blob/master/lib/index.js#L106
  process.env.CI = true;

  try {
    // Run the generator
    helpers.run(path.join(__dirname, '../generators/app'))
      // inDir() creates / cleans the specified directory
      .inDir(testDir, function(dir) {
        // Copy the fixture to the temporary directory
        fs.copySync(path.join(__dirname, 'fixtures/', srcFixtureFile), destConfitConfigPath);

        // Copy the srcNodeModuleDir into destNodeModuleDir -> CACHING the node_modules to improve test performance
        console.log('Copying cached test node_modules...');
        fs.ensureDirSync(srcNodeModuleDir);
        fs.copySync(srcNodeModuleDir, destNodeModuleDir);
      })
      .withGenerators([
        path.join(__dirname, '../generators/build'),
        path.join(__dirname, '../generators/buildAssets'),
        path.join(__dirname, '../generators/buildCSS'),
        path.join(__dirname, '../generators/buildHTML'),
        path.join(__dirname, '../generators/buildJS'),
        path.join(__dirname, '../generators/entryPoint'),
        path.join(__dirname, '../generators/paths'),
        path.join(__dirname, '../generators/sampleApp'),
        path.join(__dirname, '../generators/server'),
        //path.join(__dirname, '../generators/verify'),
        path.join(__dirname, '../generators/zzfinish')
      ])
      .withOptions({
        configFile: destFixtureFile,
        skipInstall: false,
        skipRun: true
      })
      .withPrompts({
        rebuildFromConfig: true,
        createScaffoldProject: true
      })
      .on('end', function() {
        var config = require(destConfitConfigPath)['generator-confit'];
        var server = config.server.DEV;
        var result = {
          baseUrl: [server.protocol, '://', server.hostname, ':', server.port].join('')
        };

        console.log('Saving updated node_modules to cache...');
        fs.emptyDirSync(srcNodeModuleDir);
        fs.copySync(destNodeModuleDir, srcNodeModuleDir);

        resolve(result);
      });
  } catch(err) {
    //console.error('Installation failed.');
    reject(err);
  }
}


function runGenerator(tempTestDir, confitFixtureFilename) {
  testDirName = tempTestDir;
  srcFixtureFile = confitFixtureFilename;

  return new Promise(install);
}

function clean() {}


module.exports = {
  run: runGenerator,
  cleanup: clean
};
