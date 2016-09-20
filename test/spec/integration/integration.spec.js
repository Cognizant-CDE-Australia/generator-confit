'use strict';

const fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
const fs = require('fs');
const yaml = require('js-yaml');

let testDir = process.env.TEST_DIR;
let confitConfig = yaml.load(fs.readFileSync(testDir + 'confit.yml'))['generator-confit'];

const SERVER_MAX_WAIT_TIME = 100000;  // 100 seconds


describe('test "' + fixtureFileName + '"', () => {
  // console.info(require(testDir + 'package.json'));
  if (process.env.MAX_LOG) {
    fs.readdirSync(testDir).forEach(file => console.log(file));
  }

  // Depending on the kind of Confit config, run different tests
  let projectType = confitConfig.app.projectType;
  let unitTestDir;
  let srcDir;
  let hasCSS;
  let usesGrunt;

  switch (projectType) {
    case 'browser':
      srcDir = process.env.TEST_DIR + confitConfig.paths.input.modulesDir;
      unitTestDir = srcDir + process.env.SAMPLE_APP_MODULE_DIR + confitConfig.paths.input.unitTestDir;
      usesGrunt = confitConfig.app.buildProfile === 'Webpack';  // The OLD webpack profile uses Grunt
      hasCSS = !usesGrunt;  // The OLD webpack profile uses Grunt

      require('./testSystemTest')(confitConfig, SERVER_MAX_WAIT_TIME);
      require('./testBuildServe')(confitConfig, SERVER_MAX_WAIT_TIME);
      require('./testVerify')(confitConfig, srcDir, !usesGrunt, hasCSS);
      require('./testUnitTest')(confitConfig, unitTestDir, 'npm run test:unit:once -- --no-coverage');
      require('./testDocumentation')(confitConfig);
      break;

    case 'node':
      srcDir = process.env.TEST_DIR + confitConfig.paths.input.srcDir;
      unitTestDir = process.env.TEST_DIR + confitConfig.paths.input.unitTestDir;
      usesGrunt = false;
      hasCSS = false;

      require('./testDocumentation')(confitConfig);
      require('./testVerify')(confitConfig, srcDir, !usesGrunt, hasCSS);
      require('./testUnitTest')(confitConfig, unitTestDir, 'npm run test:unit:once');
      break;

    default:
      throw new Error(`Project type ${projectType} is not valid`);
  }
});
