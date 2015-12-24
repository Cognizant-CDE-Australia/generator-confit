'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config, confitConfig) {
  var autoprefixLoader = confitConfig.buildCSS.autoprefixer ? '!autoprefixer-loader?browsers=last 2 versions' : '';
  var compilerLoader = '';

  switch (confitConfig.buildCSS.cssCompiler) {
    case 'stylus':
      compilerLoader = '!stylus-loader';
      break;

    case 'sass':
      compilerLoader = '!sass-loader';
      break;

    default:
      compilerLoader = '';
  }

  config.module.loaders.push({
    test: /\.styl$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader' + autoprefixLoader + compilerLoader)
  });

  // For any entry-point CSS file definitions, extract them as text files as well
  config.plugins.push(new ExtractTextPlugin('css/[name].[contenthash:8].css', {allChunks: true}));

  return config;
};
