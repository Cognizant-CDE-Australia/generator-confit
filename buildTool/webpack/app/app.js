'use strict';

var webpackConfigurator = require('../webpackConfigurator');

module.exports = function() {

  function write(gen) {
    gen.log('Writing "app" using Webpack');

    // We need to create:
    //  - an in-memory config object
    //  - an in-memory list of things to require()
    //
    webpackConfigurator.require({
      webpack: 'webpack'
    });


    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'webpack': '*',
      'webpack-dev-server': '*',
      'extract-text-webpack-plugin': '*',
      'on-build-webpack': '*',
      'file-loader': '*',
      'url-loader': '*'
    });

    var configDir = gen.getGlobalConfig().paths.config.configDir;
    gen.setPackageKey('scripts.start', 'node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --config ' + configDir + 'webpack/webpack.config.js --hot');
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
