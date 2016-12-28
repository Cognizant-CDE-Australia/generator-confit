/** Build START */
<%
var configPath = paths.config.configDir + 'webpack/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
-%>
// For Upgrading from Webpack 1.x, see https://webpack.js.org/how-to/upgrade-from-webpack-1/
const webpack = require('webpack');
const path = require('path');
const helpers = require('./webpackHelpers')(path.resolve(__dirname, '<%- relativePath %>'));


/*
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = Object.assign(
  {
    title: 'Confit Sample Project',
    baseUrl: '/',
    isDevServer: helpers.isWebpackDevServer(),
    HMR: HMR,
    jsSourceMap: 'cheap-source-map',    // See https://webpack.js.org/configuration/devtool/#devtool
    cssSourceMap: false,                 // There are issues with this option for the css-loader: https://github.com/webpack/css-loader#sourcemaps
    performanceHints: 'warning'
  },
  mergeOptions.metaData
);


// https://gist.github.com/sokra/27b24881210b56bbaff7#resolving-options
<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var extensions = ['.json', '.js'].concat(jsExtensions.map(function(ext) { return '.' + ext; }));
-%>
let jsExtensions = <%- printJson(extensions, 4) %>;
let moduleDirectories = ['node_modules', 'bower_components']; // Only needed to exclude directories for certain loaders, not for resolving modules.


let config = {
  context: helpers.root('<%= paths.input.srcDir.slice(0, -1) %>'),  // The baseDir for resolving the entry option and the HTML-Webpack-Plugin

  /**
   * Performance settings - https://webpack.js.org/configuration/performance/#performance
   */
  performance: {
    hints: METADATA.performanceHints
  },

  /**
   * Devtool
   * Reference: https://webpack.js.org/configuration/devtool/
   * Type of sourcemap to use per build type
   */
  devtool: METADATA.jsSourceMap,

  /**
   * Options affecting the output of the compilation.
   *
   * See: https://webpack.js.org/configuration/output/
   */
  output: {
    filename: '<%- paths.output.jsSubDir %>[name].[hash:8].js',
    chunkFilename: '<%- paths.output.jsSubDir %>[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: helpers.root('<%- paths.output.prodDir %>'),
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },

  module: {
    rules: []
  },

  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [

    // Prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin()
  ],

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7#resolving-options
     */
    extensions: jsExtensions,

    // An array of directory names to be resolved to the current directory
    modules: [helpers.root('<%- paths.input.srcDir %>'), 'node_modules']
  },


  // Output stats to provide more feedback when things go wrong:
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.js.org/configuration/node/
   */
  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};


/*
 * Loader options (for backwards compatibility)
 * See https://webpack.js.org/guides/migrating/#loaderoptionsplugin-context
 * E.g. https://github.com/jtangelder/sass-loader/issues/285
 */
let LOADER_OPTIONS = Object.assign(
  {options: {
    context: config.context
  }},
  mergeOptions.loaderOptions
);
/* **/
