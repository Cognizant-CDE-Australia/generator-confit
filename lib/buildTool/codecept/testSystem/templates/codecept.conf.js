const confitConfig = require('../confit/confit.config');
const { root, relativeRoot, getServerURL } = require('../confit/helpers');
const {getHelper} = require('../confit/codecept/helper');
const relPath = relativeRoot(__dirname);

let config = {
  name: `Codecept`,
  tests: root(`${confitConfig.paths.input.srcDir}**/*.spec.system.js`),
  timeout: 10000,
  output: relPath(`${confitConfig.paths.output.reportDir + confitConfig.paths.input.systemTestDir}`),
  helpers: Object.assign(
    getHelper({
      framework: confitConfig.buildJS.framework[0],
      config: {
        url: `${getServerURL(process.env.NODE_ENV === 'production' ? confitConfig.serverProd : confitConfig.serverDev)}`
      },
      headless: process.env.NODE_ENV === 'CI'
    })
  ),
  include: {
    I: './stepsFile.js',
    app: relPath(`${confitConfig.sampleAppModuleDir + confitConfig.paths.input.systemTestDir}pages.js`)
  },
  mocha: {
    reporterOptions: {
      reportDir: root(`${confitConfig.paths.output.reportDir + confitConfig.paths.input.systemTestDir}`),
      reportTitle: `System Tests`,
      inlineAssets: true,
      overwrite: true,
      enableCode: true
    }
  },
  multiple: {},
  bootstrap: (done) => {
    console.log('Inside Codecept Bootstrap', process.env.NODE_ENV);
    setTimeout(() => done(), process.env.NODE_ENV === 'CI' ? 5000 : 1);
  }
};


exports.config = config;

