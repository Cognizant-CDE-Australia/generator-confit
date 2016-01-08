'use strict';

var path = require('path');
var confitRunner = require('./../runConfit');

var fixtureDir = process.env.FIXTURE_DIR;
var fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
var tempTestDir = process.env.TEST_DIR;

// The set of tests to run for each fixture:
var runDevSpec = require('./testDev');


describe('test "' + fixtureFileName + '"', function() {
  installConfit();

  // The actual tests
  runDevSpec();
  //it('should do something', function(){});
});


function installConfit() {
  var fixtureFilePath = path.join(fixtureDir, fixtureFileName);
  var useExistingNodeModules = true;    // Try to preserve node_modules between test runs
  var confitInstallResult;

  // Install Confit (returns a promise, which causes Mocha to wait)
  before(function() {
    return confitRunner.run(tempTestDir, fixtureFilePath, useExistingNodeModules).then(function(result) {
      confitInstallResult = result;
    });
  });
}
