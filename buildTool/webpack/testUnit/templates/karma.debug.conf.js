// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
'use strict';
var commonConfig = require('./karma.common.js');

module.exports = function (config) {

  // Remove the coverage reporter, otherwise it runs against the instrumented code, making it difficult to debug the code.
  commonConfig.webpack.module.preLoaders = commonConfig.webpack.module.preLoaders.filter(function (loader) {
    return (loader.loader !== 'isparta');
  });

  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  commonConfig.logLevel = config.LOG_INFO;

  config.set(commonConfig);
};
