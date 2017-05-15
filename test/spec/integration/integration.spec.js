'use strict';

const fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
const fs = require('fs');
const yaml = require('js-yaml');

let testDir = process.env.TEST_DIR;
let confitConfig = yaml.load(fs.readFileSync(testDir + 'confit.yml'))['generator-confit'];

const SERVER_MAX_WAIT_TIME = 150000;  // 150 seconds


describe('test "' + fixtureFileName + '"', () => {
  // console.info(require(testDir + 'package.json'));
  if (process.env.MAX_LOG) {
    fs.readdirSync(testDir).forEach((file) => console.log(file));
  }

  // Depending on the kind of Confit config, run different tests
  let projectType = confitConfig.app.projectType;
  let unitTestDir;
  let srcDir;
  let hasCSS;

  switch (projectType) {
    case 'browser':
      srcDir = process.env.TEST_DIR + confitConfig.paths.input.modulesDir;
      unitTestDir = srcDir + process.env.SAMPLE_APP_MODULE_DIR + confitConfig.paths.input.unitTestDir;
      hasCSS = true;

      require('./testSystemTest')(confitConfig, SERVER_MAX_WAIT_TIME);
      require('./testBuildServe')(confitConfig, SERVER_MAX_WAIT_TIME);
      require('./testVerify')(confitConfig, srcDir, hasCSS);
      // Execute unit tests but do not fail if coverage is too low
      require('./testUnitTest')(confitConfig, unitTestDir, 'npm run test:unit:once -- --no-threshold-check', true);
      // Execute debug unit tests and ensure that there is NO coverage report
      require('./testUnitTest')(confitConfig, unitTestDir, 'npm run test:unit:debug:once', false);
      require('./testDocumentation')(confitConfig);
      break;

    case 'node':
      srcDir = process.env.TEST_DIR + confitConfig.paths.input.srcDir;
      unitTestDir = process.env.TEST_DIR + confitConfig.paths.input.unitTestDir;
      hasCSS = false;

      require('./testDocumentation')(confitConfig);
      require('./testVerify')(confitConfig, srcDir, hasCSS);
      require('./testUnitTest')(confitConfig, unitTestDir, 'npm run test:unit:once', true);
      break;

    default:
      throw new Error(`Project type ${projectType} is not valid`);
  }
});
