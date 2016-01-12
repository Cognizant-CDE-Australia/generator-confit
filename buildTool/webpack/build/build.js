'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack build options');

    var paths = this.getGlobalConfig().paths;
    var configDir = paths.config.configDir;

    this.defineNpmTask('build:dev', ['webpack-dev-server --progress --config ' + configDir + 'webpack/dev.webpack.config.js --hot'], 'Create a development build using Webpack');
    this.defineNpmTask('build:prod', ['webpack -p --progress --config ' + configDir + 'webpack/prod.webpack.config.js'], 'Create a production build using Webpack');
  }

  return {
    write: write
  };
};
