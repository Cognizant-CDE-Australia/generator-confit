'use strict';

// START_CONFIT_GENERATED_CONTENT
<%
var configPath = paths.config.configDir + 'webpack/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
-%>
const path = require('path');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

let config = require('./webpack.config.js');
const helpers = require('./webpackHelpers')(path.resolve(__dirname, '<%- relativePath %>'));

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HMR = helpers.hasProcessFlag('hot');

/**
 * Devtool
 * Reference: https://webpack.js.org/configuration/devtool/
 * Type of sourcemap to use per build type
 */
Object.assign(config, {
  devtool: 'cheap-module-source-map',
});

config.node.process = true;   // Not sure why we do this for development?


/**
 * Add additional plugins to the compiler.
 *
 * See: http://webpack.github.io/docs/configuration.html#plugins
 */

/**
 * Plugin: DefinePlugin
 * Description: Define free variables.
 * Useful for having development builds with debug logging or adding global constants.
 *
 * Environment helpers
 *
 * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
 */
// NOTE: when adding more properties make sure you include them in custom-typings.d.ts
config.plugins.push(
  new DefinePlugin({
    'ENV': JSON.stringify(ENV),
    'HMR': HMR,
    'process.env': {
      'ENV': JSON.stringify(ENV),
      'NODE_ENV': JSON.stringify(ENV),
      'HMR': HMR,
    }
  })
);


/**
 * Plugin LoaderOptionsPlugin (experimental)
 *
 * See: https://gist.github.com/sokra/27b24881210b56bbaff7
 */
let loaderOptions = {
  debug: true,
  options: Object.assign({}, config.loaderOptions)
};

delete config.loaderOptions;  // Remove the property so that config is valid

let loaderOptionsPlugin = new LoaderOptionsPlugin(loaderOptions);

config.plugins.push(loaderOptionsPlugin);
// END_CONFIT_GENERATED_CONTENT

module.exports = config;
