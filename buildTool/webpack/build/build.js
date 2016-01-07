'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack build options');

    var paths = gen.getGlobalConfig().paths;
    var configDir = paths.config.configDir;

    gen.defineNpmTask('build:dev', ['webpack-dev-server --progress --config ' + configDir + 'webpack/dev.webpack.config.js --hot'], 'Creates a development build using Webpack');
    gen.defineNpmTask('build:prod', ['webpack -p --progress --config ' + configDir + 'webpack/prod.webpack.config.js'], 'Creates a production build using Webpack');
  }


  function beginDevelopment(gen) {
    // This command is meant to start the development environment after installation has completed.
    if (!gen.options['skip-run']) {
      gen.spawnCommand('npm', ['start']);
    }
  }


  return {
    beginDevelopment: beginDevelopment,
    write: write
  };
};
