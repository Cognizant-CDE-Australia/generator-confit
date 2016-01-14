// Karma configuration
'use strict';

var commonConfig = require('./karma.common.js');

module.exports = function (config) {
  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  commonConfig.logLevel = config.LOG_INFO;

  // QUIRK: karma-webpack
  // Remove the CommonsChunk plugin, as it interferes with testing (and doesn't affect code execution)
  // https://github.com/webpack/karma-webpack/issues/24
  commonConfig.webpack.plugins = commonConfig.webpack.plugins.filter(function (plugin) {
    return !(plugin.ident && plugin.ident.indexOf('CommonsChunkPlugin'));
  });

  config.set(commonConfig);
};
