'use strict';

module.exports = function() {

  function write() {
    this.log('Writing "app" using Webpack');

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'webpack': '*',
      'webpack-dev-server': '*'
    });
  }


  function beginDevelopment() {
    // This command is meant to start the development environment after installation has completed.
    if (!this.options['skip-run']) {
      this.spawnCommand('npm', ['start']);
    }
  }


  return {
    beginDevelopment: beginDevelopment,
    write: write
  };
};
