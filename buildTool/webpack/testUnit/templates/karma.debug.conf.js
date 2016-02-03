// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
'use strict';

// START_CONFIT_GENERATED_CONTENT
var commonConfig = require('./karma.common.js');

function getConfitConfig(config) {

  // Remove the coverage reporter, otherwise it runs against the instrumented code, making it difficult to debug the code.
  commonConfig.webpack.module.postLoaders = commonConfig.webpack.module.postLoaders.filter(function (loader) {
    return (loader.loader.indexOf('istanbul-instrumenter-loader') === -1);
  });

  // QUIRK: karma-webpack
  // Remove the CommonsChunk plugin, as it interferes with testing (and doesn't affect code execution)
  // https://github.com/webpack/karma-webpack/issues/24
  commonConfig.webpack.plugins = commonConfig.webpack.plugins.filter(function (plugin) {
    return !(plugin.ident && plugin.ident.indexOf('CommonsChunkPlugin'));
  });

  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  commonConfig.logLevel = config.LOG_INFO;

  config.set(commonConfig);
};
// END_CONFIT_GENERATED_CONTENT

module.exports = getConfitConfig;
