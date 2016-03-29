// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var srcFileRegEx = new RegExp(paths.input.modulesDir.replace(/\//g, '\\/') + ".*\\.(" + jsExtensions.join('|') + ")$");

var configPath = paths.config.configDir + 'testUnit/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
-%>

// We want to re-use the loaders from the dev.webpack.config
var webpackConfig = require('./../webpack/dev.webpack.config.js');


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
    'karma-spec-reporter',
    'karma-sourcemap-loader'
  ],

  files: [
    'node_modules/phantomjs-polyfill/bind-polyfill.js',
    '<%- paths.config.configDir %>testUnit/test.files.js'
  ],

  preprocessors: {
    '<%- paths.config.configDir %>testUnit/test.files.js': ['webpack']
  },


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

<%
// If the code is ES5 or ES6, we can use the instrumenter as a pre-loader, to instument the original source code
// (which isparta understands).
// For Typescript, there is no code coverage tool that understands TypeScript's source. So use a post-loader
// to instrument the transpiled source code. This is less than ideal, but we are waiting for the tools to arrive

var testUnitSourceFormatConfig = buildTool.testUnit.sourceFormat[buildJS.sourceFormat];
%>

  webpack: {
    module: {
      <%= testUnitSourceFormatConfig.loaderType %>: [
        // instrument only testing sources
        {
          test: <%= srcFileRegEx.toString() %>,
          loader: '<%= testUnitSourceFormatConfig.loaderName %>',
          exclude: [
            /node_modules|<%= paths.input.unitTestDir.replace(/\//g, '\\/') %>|<%= paths.input.browserTestDir.replace(/\//g, '\\/') %>/
          ]<% if (testUnitSourceFormatConfig.query) { %>,
          query: <%- JSON.stringify(testUnitSourceFormatConfig.query, null, '  ').replace(/"/g, '\'') %><% } %>
        }
      ],
      loaders: webpackConfig.module.loaders
    },
    plugins: webpackConfig.plugins,
    resolve: webpackConfig.resolve
  },

  webpackServer: {
    noInfo: true
  },

  singleRun: false,
  colors: true
};
// END_CONFIT_GENERATED_CONTENT

module.exports = karmaConfig;
