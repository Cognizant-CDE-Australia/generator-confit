/** Build START */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var helpers = require('./webpackHelpers');
var basePath = process.cwd() + path.sep;

// https://gist.github.com/sokra/27b24881210b56bbaff7#resolving-options
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var extensions = ['.json', '.js'].concat(jsExtensions.map(function(ext) { return '.' + ext; }));
-%>
var jsExtensions = <%- printJson(extensions, 4) %>;
var moduleDirectories = ['node_modules', 'bower_components']; // Only needed to exclude directories for certain loaders, not for resolving modules.

var config = {
  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  devtool: 'source-map',
  context: path.join(basePath, '<%= paths.input.srcDir.slice(0, -1) %>'),  // The baseDir for resolving the entry option and the HTML-Webpack-Plugin
  output: {
    filename: '<%= paths.output.jsSubDir %>[name].[hash:8].js',
    chunkFilename: '<%= paths.output.jsSubDir %>[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: '<%= paths.output.prodDir %>',
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },
  module: {
    loaders: []
  },
  plugins: [
    // Prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin()
  ],

  resolve: {
    //https://gist.github.com/sokra/27b24881210b56bbaff7#resolving-options
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
