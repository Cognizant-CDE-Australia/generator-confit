// Global karma config
'use strict';

// START_CONFIT_GENERATED_CONTENT
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var srcFileRegEx = new RegExp(paths.input.modulesDir.replace(/\//g, '\\/') + ".*\\.(" + jsExtensions.join('|') + ")$");
-%>

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
    '<%- paths.input.modulesDir %>/**/*.(<%= jsExtensions.join('|') %>)': ['coverage'],
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

  webpack: {
    module: {
      postLoaders: [
        // instrument only testing sources with Istanbul
        {
          test: <%= srcFileRegEx.toString() %>,
          loader: 'istanbul-instrumenter-loader',
          exclude: [
            /node_modules|<%= paths.input.unitTestDir.replace(/\//g, '\\/') %>|<%= paths.input.browserTestDir.replace(/\//g, '\\/') %>/
          ]
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
