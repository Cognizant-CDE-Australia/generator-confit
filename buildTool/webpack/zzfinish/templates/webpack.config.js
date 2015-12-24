'use strict';

var path = require('path');
var confitConfig = require(path.join(process.cwd(), 'confit.json'))['generator-confit'];  // Keep the code lively! If confit.json changes, this code still works.
var webpack = require('webpack');

var config = {
   /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  devtool: 'source-map',
  module: {
    loaders: []
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],

  // Output stats to provide more feedback when things go wrong:
  stats: {
    colors: true,
    modules: true,
    reasons: true
  }
};

require('./webpack.entryPoint.config')(config, confitConfig);
require('./webpack.build.config')(config, confitConfig);
require('./webpack.buildAssets.config')(config, confitConfig);
require('./webpack.buildJS.config')(config, confitConfig);
require('./webpack.buildCSS.config')(config, confitConfig);
require('./webpack.buildHTML.config')(config, confitConfig);

/*
var config = {


  module: {

    loaders: [


      {
        test: /\.html$/,
        loader: 'html-loader?minimize=true'
      }
    ],

  }
};
*/

module.exports = config;
