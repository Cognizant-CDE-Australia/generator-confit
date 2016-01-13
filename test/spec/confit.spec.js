'use strict';

var fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
var testDir = process.env.TEST_DIR;
var confitConfig = require(testDir + 'confit.json')['generator-confit'];


describe('test "' + fixtureFileName + '"', function () {
  // The actual tests...
  require('./testDev')(confitConfig);
  require('./testVerify')(confitConfig);
  require('./testUnitTest')(confitConfig);
});
