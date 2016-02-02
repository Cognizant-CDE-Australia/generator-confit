// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT

// We want to re-use the loaders from the dev.webpack.config
var webpackConfig = require('./../webpack/dev.webpack.config.js');


var karmaConfig = {
  autoWatch: true,

  // base path, that will be used to resolve files and exclude
  basePath: '../../',

  // testing framework to use (jasmine/mocha/qunit/...)
  frameworks: ['jasmine'],

  // list of files / patterns to load in the browser - defined in /config/grunt/unitTest.js

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
    var jsExtension = (buildJS.sourceFormat === 'TypeScript') ? 'ts' : 'js';
    var preLoaders = (buildJS.sourceFormat === 'TypeScript') ? '!ts-loader' : '';
  -%>

  webpack: {
    module: {
      // Obtained from http://stackoverflow.com/questions/32170176/getting-karma-code-coverage-for-pre-transpilation-souce-code
      preLoaders: [{
        test: /\.<%= jsExtension %>$/,
        exclude: /(<%- paths.input.unitTestDir.substr(0, paths.input.unitTestDir.length - 1) %>|<%- paths.input.browserTestDir.substr(0, paths.input.browserTestDir.length - 1) %>|node_modules|bower_components|<%- paths.config.configDir.substr(0, paths.config.configDir.length - 1) %>)\//,
        loader: 'isparta<%= preLoaders %>'
      }],
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
