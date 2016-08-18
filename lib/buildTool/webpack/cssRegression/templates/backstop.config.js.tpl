'use strict';
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
let scenarios = require('../../<%- paths.input.unitTestDir %>cssRegression/scenarios');

scenarios.forEach((scenario) => {
  scenario.url = `${BASE_URL}${scenario.url}`
});
config.scenarios = scenarios;

module.exports = config;
