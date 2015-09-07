'use strict';

/**
 * WebpackConfigurator is a way of sharing configuration between generators (hopefully)
 * @type {exports|module.exports}
 * @private
 */


var _ = require('lodash');

var state = {
  config: {},
  require: {}
};


function mergeRequireConfig(newConfig) {
  _.assign(state.require, newConfig);
}


function mergeWebpackConfig(newConfig) {
  _.assign(state.config, newConfig);
}



module.exports = {
  require: mergeRequireConfig,
  addConfig: mergeWebpackConfig,
  getConfig: function() {
    return _.clone(state, true);    // Do a deep clone
  }
};
