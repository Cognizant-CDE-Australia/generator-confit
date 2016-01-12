'use strict';

var path = require('path');
var confitRunner = require('./../runConfit');

var fixtureDir = process.env.FIXTURE_DIR;
var fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
var tempTestDir = process.env.TEST_DIR;


function installConfit() {
  var fixtureFilePath = path.join(fixtureDir, fixtureFileName);
  var useExistingNodeModules = true;    // Try to preserve node_modules between test runs

  return confitRunner.run(tempTestDir, fixtureFilePath, useExistingNodeModules).then(function(result) {
    return Promise.resolve(result);
  });
}

// Once we install, we have access to the Confit config, which our tests may want to use
installConfit().then(function(confitConfig) {

  describe('test "' + fixtureFileName + '"', function() {
    // The actual tests
    require('./testDev')(confitConfig);
    require('./testVerify')(confitConfig);
    require('./testUnitTest')(confitConfig);
  });

  // The mocha --delay flag provides a root-level run() callback, signifying that we have finished the initial asynchronous processing
  run();
});

