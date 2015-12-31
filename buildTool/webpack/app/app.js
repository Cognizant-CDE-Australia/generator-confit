'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing "app" using Webpack');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'webpack': '*',
      'webpack-dev-server': '*'
    });

    var configDir = gen.getGlobalConfig().paths.config.configDir;
    gen.setPackageKey('scripts.start', 'node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --config ' + configDir + 'webpack/dev.webpack.config.js --hot');
    gen.setPackageKey('scripts.build', 'node_modules/webpack/bin/webpack.js -p --progress --config ' + configDir + 'webpack/prod.webpack.config.js');
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
