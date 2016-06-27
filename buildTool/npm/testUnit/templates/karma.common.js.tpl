// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT
<%

var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var testFilesRegEx = new RegExp(paths.input.unitTestDir.replace(/\//g, '\\/') + ".*spec\\.(" + jsExtensions.join('|') + ")$");

// We only want to test the SOURCE FILES, but we still must IMPORT the test dependencies
-%>
var testFilesRegEx = <%= testFilesRegEx.toString() %>;

// Customise the testFilesRegEx to filter which files to test, if desired.
// E.g.
// if (process.argv.indexOf('--spec') !== -1) {
//   testFilesRegEx = ...
// }
var browsers = ['PhantomJS'];
var preprocessorList = ['coverage'];
var testSpecs = ''<%- paths.input.unitTest %>**/*.spec.js';
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var srcFileRegEx = new RegExp(paths.input.srcDir.replace(/\//g, '\\/') + ".*\\.(" + jsExtensions.join('|') + ")$");

var configPath = paths.config.configDir + 'testUnit/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
-%>

var karmaConfig = {
  autoWatch: true,

  // base path, that will be used to resolve files and exclude
  basePath: '<%= relativePath %>',

  // testing framework to use (jasmine/mocha/qunit/...)
  frameworks: ['jasmine'],

  // list of files / patterns to exclude
  exclude: [],

  // web server default port
  port: 8081,

  // Start these browsers, currently available:
  // - Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
  browsers: browsers,

  plugins: [
    'karma-phantomjs-launcher',
    'karma-jasmine',
    'karma-junit-reporter',
    'karma-coverage',
    'karma-chrome-launcher',
    'karma-spec-reporter'
  ],

  files: [
    'node_modules/phantomjs-polyfill/bind-polyfill.js',
    testSpecs
  ],

  reporters: ['progress', 'junit', 'coverage'],

  coverageReporter: {
    dir: '<%- paths.output.reportDir %>coverage',
    reporters: [
      { type: 'cobertura', subdir: 'cobertura' },
      { type: 'lcovonly', subdir: 'lcov' },
      { type: 'html', subdir: 'html' },
      { type: 'json', subdir: 'json' },
      { type: 'text' }
    ]
  },

  junitReporter: {
    outputDir: '<%- paths.output.reportDir %>unit/'
  },

  singleRun: false,
  colors: true
};

karmaConfig.preprocessors[testSpecs] = preprocessorList;
// END_CONFIT_GENERATED_CONTENT

module.exports = karmaConfig;
