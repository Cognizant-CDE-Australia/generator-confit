/** Finalise Config START */
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
const DefinePlugin = require('webpack/lib/DefinePlugin');

let definePlugin = new DefinePlugin({
  'ENV': JSON.stringify(METADATA.ENV),
  'HMR': METADATA.HMR,
  'process.env': {
    'ENV': JSON.stringify(METADATA.ENV),
    'NODE_ENV': JSON.stringify(METADATA.ENV),
    'HMR': METADATA.HMR,
  }
});

config.plugins.push(definePlugin);

/**
 * Plugin LoaderOptionsPlugin (experimental)
 *
 * See: https://gist.github.com/sokra/27b24881210b56bbaff7
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

let loaderOptionsPlugin = new LoaderOptionsPlugin(LOADER_OPTIONS);

config.plugins.push(loaderOptionsPlugin);
/* **/
