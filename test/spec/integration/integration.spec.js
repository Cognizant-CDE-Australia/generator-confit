'use strict';

const fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
const fs = require('fs');
let testDir = process.env.TEST_DIR;
let confitConfig = require(testDir + 'confit.json')['generator-confit'];

const SERVER_MAX_WAIT_TIME = 100000;  // 100 seconds

describe('test "' + fixtureFileName + '"', function () {
  //console.info(require(testDir + 'package.json'));
  if (process.env.MAX_LOG) {
    fs.readdirSync(testDir).forEach(file => console.log(file));
  }
  // The actual tests...
  require('./testDev')(confitConfig, SERVER_MAX_WAIT_TIME);
  require('./testBuildServe')(confitConfig, SERVER_MAX_WAIT_TIME);
  require('./testVerify')(confitConfig);
  require('./testUnitTest')(confitConfig);
});
