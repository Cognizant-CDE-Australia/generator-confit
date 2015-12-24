var _ = require('lodash');
var config = require('./webpack.config.js');
var webpack = require('webpack');

_.merge(config, {
  debug: false,
  devtool: 'source-map'
});

// Merging of arrays is tricky - just push the item onto the existing array
config.plugins.push(new webpack.DefinePlugin({
  __DEV__: false,
  __PROD__: true
}));

module.exports = config;
