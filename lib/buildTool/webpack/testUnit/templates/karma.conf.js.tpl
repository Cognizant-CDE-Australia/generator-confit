// Karma configuration
'use strict';

// START_CONFIT_GENERATED_CONTENT
var commonConfig = require('./karma.common.js');
var webpackHelpers = require('../webpack/webpackHelpers.js')();
var debugMode = process.argv.indexOf('--debug') > -1;
var noThresholdCheck = process.argv.indexOf('--no-threshold-check') > -1;

function getConfitConfig(config) {
  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  commonConfig.logLevel = config.LOG_INFO;

  // QUIRK: karma-webpack
  // Remove the CommonsChunk plugin, as it interferes with testing (and doesn't affect code execution)
  // https://github.com/webpack/karma-webpack/issues/24
  commonConfig.webpack.plugins = commonConfig.webpack.plugins.filter(function (plugin) {
    return !(plugin.ident && plugin.ident.indexOf('CommonsChunkPlugin'));
  });


  if (debugMode) {
    <% if (buildJS.sourceFormat === 'TypeScript') { %>
    // Remove the coverage reporter, otherwise it runs against the instrumented code, making it difficult to debug the code.
    commonConfig.webpack.module.rules = commonConfig.webpack.module.rules.filter(function (rule) {
      return !webpackHelpers.hasLoader(rule, 'istanbul-instrumenter-loader');
    });
    <% } -%>

    // No point checking threshold if we removing the the coverage tool
    commonConfig.reporters = commonConfig.reporters.filter(function(reporter) {
      return reporter !== 'threshold' && reporter !== 'coverage';
    });
  }

  if (noThresholdCheck) {
    commonConfig.reporters = commonConfig.reporters.filter(function(reporter) {
      return reporter !== 'threshold';
    });
  }

  config.set(commonConfig);
};
// END_CONFIT_GENERATED_CONTENT

module.exports = getConfitConfig;
