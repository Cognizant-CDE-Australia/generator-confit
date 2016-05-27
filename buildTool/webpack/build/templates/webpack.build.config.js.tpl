/** Build START */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var helpers = require('./webpackHelpers');
var basePath = process.cwd() + path.sep;

// https://webpack.github.io/docs/configuration.html#resolve-extensions
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var extensions = ['', '.webpack.js', '.web.js', '.js'].concat(jsExtensions.map(function(ext) { return '.' + ext; }));
-%>
var jsExtensions = <%- printJson(extensions, 4) %>;
var moduleDirectories = ['node_modules', 'bower_components'];

var config = {
  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  devtool: 'source-map',
  context: path.join(basePath, '<%= paths.input.srcDir.slice(0, -1) %>'),  // The baseDir for resolving the entry option and the HTML-Webpack-Plugin
  output: {
    filename: path.join('<%= paths.output.jsSubDir %>[name].[hash:8].js'),
    chunkFilename: path.join('<%= paths.output.jsSubDir %>[id].[chunkhash:8].js'),  // The name for non-entry chunks
    path: path.join('<%= paths.output.prodDir %>'),
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },
  module: {
    loaders: []
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],

  resolve: {
    // https://webpack.github.io/docs/configuration.html#resolve-modulesdirectories
    modulesDirectories: moduleDirectories,
    extensions: jsExtensions
  },

  // Output stats to provide more feedback when things go wrong:
  stats: {
    colors: true,
    modules: true,
    reasons: true
  }
};
/* **/
