'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');
var confitConfig = require(path.join(process.cwd(), 'confit.json'))['generator-confit'];  // Keep the code lively! If confit.json changes, this code still works.
var projectPaths = confitConfig.paths;
var basePath = process.cwd() + '/';

var config = {
  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  devtool: 'source-map',
<%- include('../../entryPoint/templates/webpack.entryPoint.config.js.tpl') %>
<%- include('../../build/templates/webpack.build.config.js.tpl') %>
  module: {
    loaders: []
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],

  //https://webpack.github.io/docs/configuration.html#resolve-modulesdirectories
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components']
  },

  // Output stats to provide more feedback when things go wrong:
  stats: {
    colors: true,
    modules: true,
    reasons: true
  }
};

<%- include('../../buildJS/templates/webpack.buildJS.config.js.tpl') %>
<%- include('../../buildAssets/templates/webpack.buildAssets.config.js.tpl') %>
<%- include('../../buildCSS/templates/webpack.buildCSS.config.js.tpl') %>
<%- include('../../buildHTML/templates/webpack.buildHTML.config.js.tpl') %>
<%- include('../../serverDev/templates/webpack.serverDev.config.js.tpl') %>


module.exports = config;
