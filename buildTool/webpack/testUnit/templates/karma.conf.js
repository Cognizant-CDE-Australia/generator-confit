// Karma configuration
'use strict';

var commonConfig = require('./karma.common.js');

module.exports = function (config) {
  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  commonConfig.logLevel = config.LOG_INFO;

  config.set(commonConfig);
};
