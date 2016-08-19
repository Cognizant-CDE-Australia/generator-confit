'use strict';
const glob = require('glob');
const path = require('path');
const BASE_URL = '<%- serverDev.protocol %>://localhost:<%- serverDev.port %>';
let config = {
  viewports: [
    {
      name: 'desktop',
      width: 1280,
      height: 1024
    }
  ],
  paths: {
    'bitmaps_reference': '../../<%- paths.output.reportDir %>cssRegression/backstop_data/bitmaps_reference',
    'bitmaps_test': '../../<%- paths.output.reportDir %>cssRegression/backstop_data/bitmaps_test',
    'compare_data': '../../<%- paths.output.reportDir %>cssRegression/backstop_data/bitmaps_test/compare.json',
    'casper_scripts': '../../<%- paths.input.unitTestDir %>/cssRegression/scripts',
    'ci_report' :  '../../<%- paths.output.reportDir %>cssRegression/backstop_data/ci_report'
  },
  engine: 'phantomjs',
  report: ['CLI', 'browser', 'CI'],
  casperFlags: [
    '--ignore-ssl-errors=true',
    '--ssl-protocol=any'
  ],
  debug: false,
  port: 3002
};
const scenarioDefaultConfig = {
  readyEvent: null,
  delay: 500,
  misMatchThreshold: 0.1
};
let scenarioFiles = glob.sync('<%- paths.input.srcDir %>**/*/cssTest/*.?(js|json)');
let scenarios = [];
let srcDirRelativePath = path.relative('<%- paths.config.configDir %>cssRegression', '<%- paths.input.srcDir %>');

scenarioFiles.forEach((scenarioPath) => {
  let scenario = require(`${srcDirRelativePath}${scenarioPath.replace('<%- paths.input.srcDir %>', '')}`);

  scenario = Object.assign({}, scenarioDefaultConfig, scenario, {url: `${BASE_URL}${scenario.url}`});
  scenarios.push(scenario);
});

config.scenarios = scenarios;
module.exports = config;
