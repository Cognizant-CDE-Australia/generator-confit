// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT
<%

var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var testFilesRegEx = new RegExp(paths.input.unitTestDir.replace(/\//g, '\\/') + ".*spec\\.(" + jsExtensions.join('|') + ")$");
var testFilesGlob = '**/' + paths.input.unitTestDir + '*.spec.(' + jsExtensions.join('|') + ')';

// We only want to test the SOURCE FILES, but we still must IMPORT the test dependencies
-%>
var DefinePlugin = require('webpack').DefinePlugin;   // Needed to pass the testFilesRegEx to test.files.js
var testFilesRegEx = <%= testFilesRegEx.toString() %>;
var testFilesGlob = '<%- testFilesGlob %>';

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
var webpackConfig = require('./../webpack/dev.webpack.config.js');
var preprocessorList = ['<%- preprocessorList.join("', '") %>'];

<% if (buildJS.sourceFormat === 'ES6') { %>
// Modify the Babel loader to add the Istanbul Babel plugin for code coverage
webpackConfig.module.loaders.forEach(loader => {
  if (loader.loader === 'babel-loader') {
    loader.query = loader.query || {};
    loader.query.plugins = loader.query.plugins || [];
    loader.query.plugins.push([
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

  webpack: {
    module: {
      <% if (buildJS.sourceFormat === 'TypeScript') { %>postLoaders: [
        // instrument only testing *sources* (not the tests)
        {
          test: <%= srcFileRegEx.toString() %>,
          loader: 'istanbul-instrumenter-loader',
          exclude: [
            /node_modules|<%= testSourcesToExclude.join('|') %>/
          ]
        }
      ],<% } %>
      loaders: webpackConfig.module.loaders
    },
    <% if (buildJS.framework.indexOf('React (latest)') > -1) { %>
    // Externals needed for Enzyme to test React components. See https://github.com/airbnb/enzyme/blob/master/docs/guides/karma.md
    externals: {
      'cheerio': 'window',
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },<% } %>
    plugins: webpackConfig.plugins.concat([new DefinePlugin({
      __karmaTestSpec: testFilesRegEx
    })]),
    resolve: webpackConfig.resolve,
    devtool: 'inline-source-map'      // Changed to allow the sourcemap loader to work: https://github.com/webpack/karma-webpack
  },

  webpackServer: {
    noInfo: true
  },

  singleRun: false,
  colors: true
};
// END_CONFIT_GENERATED_CONTENT

module.exports = karmaConfig;
