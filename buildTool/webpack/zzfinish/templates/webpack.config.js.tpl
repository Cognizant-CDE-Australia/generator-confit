'use strict';

var path = require('path');

var basePath = process.cwd() + '/';

<% for (var prop in webpack.require) { %>var <%= webpack.require[prop] %> = require('<%= prop %>');
<% } %>

var config = {
  debug: 'source-map',
  context: basePath + '<%= paths.input.srcDir.substr(0, paths.input.srcDir.length - 1) %>'
  entry: {
    app: '<%= buildJS.bundles %>',
    vendor: <% var vendors = []
      for (var obj in buildJS.vendorBowerScripts) {
        vendors.push(obj.name);
      }
    %><%= vendors %>
  },

  output: {
    filename: '<%= paths.output.jsSubDir %>[name].[hash:8].js',
    chunkFilename: '<%= paths.output.jsSubDir %>[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: '<%= paths.output.prodDir %>',
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  }

  module: {

    loaders: [
      // Fonts
      {
        test: /<%= paths.input.assetsDir.replace(/\//g, '\\/') %>.*\.(eot|otf|svg|ttf|woff|woff2)$/,    // SVG fonts
        loader: 'file-loader?name=/<%= paths.output.assetsSubDir %>[1]/font/[name].[hash:8].[ext]&regExp=<%= paths.input.modulesSubDir %>(.*)/<%= paths.input.assetsDir %>.*'
      },

      // Images
      {
        test: /<%= paths.input.assetsDir.replace(/\//g, '\\/') %>img\/.*\.(gif|ico|jpg|png|svg)$/,
        loader: 'file-loader?name=/<%= paths.output.assetsSubDir %>[1]/img/[name].[hash:8].[ext]&regExp=<%= paths.input.modulesSubDir %>(.*)/<%= paths.input.assetsDir %>/img/.*'
      },

      <% if (buildCSS.cssCompiler === 'stylus') { %>
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!<%= buildCSS.autoprefixer ? 'autoprefixer-loader?browsers=last 2 versions!' : '' %>stylus-loader')
      },
      <% } %>

      <% if (buildCSS.cssCompiler === 'sass') { %>
      {
        test: /(\.sass|\.scss)$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!<%= buildCSS.autoprefixer ? 'autoprefixer-loader?browsers=last 2 versions!' : '' %>sass-loader')
      },
      <% } %>

      // If ES6 -> ES5
      {
        test: /(<%= paths.input.modulesDir.replace(/\//g, '\\/') %>.*|test_index)\.js$/,
        loader: 'babel-loader?optional=runtime'
      },

      {
        test: /\.html$/,
        loader: 'html-loader?minimize=true'
      }
    ],

    preLoaders: [
      // Verify
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'jshint-loader!jscs-loader'
      },
      // If we are use stylus, should we just include this by default?
      {
        test: /\.styl$/,
        loader: 'stylint?{brackets: "never"}'
      }
    ]

  }
};

module.exports = config;
