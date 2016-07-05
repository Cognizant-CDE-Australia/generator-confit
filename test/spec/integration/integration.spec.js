'use strict';

const fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
const fs = require('fs');
let testDir = process.env.TEST_DIR;
let confitConfig = require(testDir + 'confit.json')['generator-confit'];

const SERVER_MAX_WAIT_TIME = 100000;  // 100 seconds


describe('test "' + fixtureFileName + '"', () => {
  //console.info(require(testDir + 'package.json'));
  if (process.env.MAX_LOG) {
    fs.readdirSync(testDir).forEach(file => console.log(file));
  }

  // Depending on the kind of Confit config, run different tests
  let projectType = confitConfig.app.projectType;
  let unitTestDir, srcDir;

  switch (projectType) {
    case 'browser':
      srcDir = process.env.TEST_DIR + confitConfig.paths.input.modulesDir;
      unitTestDir = srcDir + process.env.SAMPLE_APP_MODULE_DIR + confitConfig.paths.input.unitTestDir;

      require('./testBrowserDev')(confitConfig, SERVER_MAX_WAIT_TIME);
      require('./testBuildServe')(confitConfig, SERVER_MAX_WAIT_TIME);
      require('./testVerify')(confitConfig, srcDir);
      require('./testUnitTest')(confitConfig, unitTestDir);
      break;

    case 'node':
      srcDir = process.env.TEST_DIR + confitConfig.paths.input.srcDir;
      unitTestDir = process.env.TEST_DIR + confitConfig.paths.input.unitTestDir;

      require('./testVerify')(confitConfig, srcDir);
      require('./testUnitTest')(confitConfig, unitTestDir);
      break;
  }
});
