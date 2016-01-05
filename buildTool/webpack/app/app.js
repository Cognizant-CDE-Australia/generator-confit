'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing "app" using Webpack');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'webpack': '*',
      'webpack-dev-server': '*'
    });

    var paths = gen.getGlobalConfig().paths;
    var configDir = paths.config.configDir;
    gen.setPackageKey('scripts.start', 'node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --config ' + configDir + 'webpack/dev.webpack.config.js --hot');
    gen.setPackageKey('scripts.clean', 'rm -rf ' + paths.output.prodDir);
    gen.setPackageKey('scripts.build', 'npm run clean && node_modules/webpack/bin/webpack.js -p --progress --config ' + configDir + 'webpack/prod.webpack.config.js');

    // Things to do one-time - preinstall
    gen.setPackageKey('scripts.postinstall', 'npm run fixDistDebugRef');

    // Fix the problem with Bower components: Module not found: Error: Cannot resolve 'file' or 'directory' ./dist/debug.js
    gen.setPackageKey('scripts.fixDistDebugRef', 'mkdir -p node_modules/debug/dist && cp node_modules/debug/debug.js node_modules/debug/dist/');
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
