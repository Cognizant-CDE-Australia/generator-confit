// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT
<%

var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var testFilesRegEx = new RegExp(paths.input.unitTestDir.replace(/\//g, '\\/') + ".*spec\\.(" + jsExtensions.join('|') + ")$");
var testFilesGlob = '**/' + paths.input.unitTestDir + '*.spec.(' + jsExtensions.join('|') + ')';

// We only want to test the SOURCE FILES, but we still must IMPORT the test dependencies
-%>
const DefinePlugin = require('webpack').DefinePlugin;   // Needed to pass the testFilesRegEx to test.files.js
let testFilesRegEx = <%- testFilesRegEx.toString() %>;
let testFilesGlob = '<%- testFilesGlob %>';

// Customise the testFilesRegEx to filter which files to test, if desired.
// E.g.
// if (process.argv.indexOf('--spec') !== -1) {
//   testFilesRegEx = ...
//   testFilesGlob = ...
// }
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var srcFileRegEx = new RegExp(paths.input.modulesDir.replace(/\//g, '\\/') + ".*\\.(" + jsExtensions.join('|') + ")$");

var configPath = paths.config.configDir + resources.testUnit.configSubDir;
var relativePath = configPath.replace(/([^/]+)/g, '..');
var preprocessorList = ['webpack', 'sourcemap'];

// The Non-TypeScript code-coverage plugin doesn't need 'coverage' as a pre-processor.
if (buildJS.sourceFormat === 'TypeScript') {
  preprocessorList = ['coverage'].concat(preprocessorList);
}
-%>
// We want to re-use the loaders from the dev.webpack.config
let webpackConfig = require('./../webpack/dev.webpack.config.js');
let preprocessorList = ['<%- preprocessorList.join("', '") %>'];

let karmaConfig = {
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
  browsers: [
    'PhantomJS'
  ],

  plugins: [
    'karma-phantomjs-launcher',
    'karma-jasmine',
    'karma-junit-reporter',
    'karma-coverage',
    'karma-chrome-launcher',
    require('karma-webpack'),
    'karma-sourcemap-loader',
    'karma-threshold-reporter'
  ],

  files: [
    'node_modules/phantomjs-polyfill/bind-polyfill.js',
    '<%- paths.config.configDir + resources.testUnit.configSubDir %>test.files.js'
  ],

  preprocessors: {
    '<%- paths.config.configDir + resources.testUnit.configSubDir %>test.files.js': preprocessorList
  },

  reporters: ['progress', 'junit', 'coverage', 'threshold'],

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

  thresholdReporter: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  },

  // Webpack please don't spam the console when running in karma!
  webpackMiddleware: { stats: 'errors-only'},

  singleRun: false,
  colors: true
};


<% if (buildJS.sourceFormat === 'ES6') { %>
// Modify the Babel loader to add the Istanbul Babel plugin for code coverage
webpackConfig.module.rules.forEach(loader => {
  if (loader.loader === 'babel-loader') {
    loader.options = loader.options || {};
    loader.options.plugins = loader.options.plugins || [];
    loader.options.plugins.push([
      'istanbul',
      {
        'exclude': [
          testFilesGlob,
          'node_modules/**'
        ]
      }
    ]);
  }
});
<% } -%>

<%
// For Typescript, there is no code coverage tool that understands TypeScript's source. So use a post-loader
// to instrument the transpiled source code. This is less than ideal, but we are waiting for the tools to improve.

var testUnitSourceFormatConfig = buildTool.testUnit.sourceFormat[buildJS.sourceFormat];
var testSourcesToExclude = [paths.input.unitTestDir, paths.input.systemTestDir];

if (testVisualRegression.enabled) {
  testSourcesToExclude.push(testVisualRegression.moduleTestDir);
}
testSourcesToExclude = testSourcesToExclude.map(function(dir) {return dir.replace(/\//g, '\\/');});
%>


<% if (buildJS.sourceFormat === 'TypeScript') { %>
// instrument only testing *sources* (not the tests)
webpackConfig.module.rules.push({
  test: <%- srcFileRegEx.toString() %>,
  use: [
    {
      loader: 'istanbul-instrumenter-loader'
    }
  ],
  enforce: 'post',
  exclude: [/node_modules|<%- testSourcesToExclude.join('|') %>/]
});<% } %>

<% if (buildJS.framework.indexOf('React (latest)') > -1) { %>
// Externals needed for Enzyme to test React components. See https://github.com/airbnb/enzyme/blob/master/docs/guides/karma.md
webpackConfig.externals = Object.assign(webpackConfig.externals || {}, {
  'cheerio': 'window',
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true
});<% } %>

webpackConfig.plugins.push(new DefinePlugin({
  __karmaTestSpec: testFilesRegEx
}));

// Change devtool to allow the sourcemap loader to work: https://github.com/webpack/karma-webpack
webpackConfig.devtool = 'inline-source-map';

karmaConfig.webpack = webpackConfig;
// END_CONFIT_GENERATED_CONTENT

module.exports = karmaConfig;
