'use strict';

// START_CONFIT_GENERATED_CONTENT
let config = require('./webpack.config.js');
let webpack = require('webpack');

Object.assign(config, {
  debug: true,
  devtool: 'source-map'
});

// Merging of arrays is tricky - just push the item onto the existing array
config.plugins.push(new webpack.DefinePlugin({
  __DEV__: true,
  __PROD__: false
}));
// END_CONFIT_GENERATED_CONTENT

module.exports = config;
