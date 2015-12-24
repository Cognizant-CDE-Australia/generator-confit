'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(config, confitConfig) {

  config.module.loaders.push({
    test: /\.html$/,
    loader: 'html-loader?minimize=true'
  });

  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index-template.html'
    })
  );

  return config;
};
