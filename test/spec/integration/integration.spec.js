'use strict';

var fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
var testDir = process.env.TEST_DIR;
var confitConfig = require(testDir + 'confit.json')['generator-confit'];
var fs = require('fs');

describe('test "' + fixtureFileName + '"', function () {
  //console.info(require(testDir + 'package.json'));
  fs.readdirSync(testDir).forEach(file => console.log(file));
  // The actual tests...
  require('./testDev')(confitConfig);
  require('./testBuildServe')(confitConfig);
  require('./testVerify')(confitConfig);
  require('./testUnitTest')(confitConfig);
});
