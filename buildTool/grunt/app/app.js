module.exports = function() {
  'use strict';

  function write() {
    //gen.log('Writing "app" using GruntJS');

    this.fs.copy(
      this.toolTemplatePath('../../app/templates/_Gruntfile.js'),
      this.destinationPath('Gruntfile.js')
    );

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'grunt-extend-config': '*',
      'load-grunt-tasks': '*'
    });
  }

  function beginDevelopment() {
    // This command is meant to start the development environment after installation has completed.
    if (!this.options['skip-run']) {
      this.spawnCommand('grunt', ['dev', '--url=index.html']);
    }
  }


  return {
    beginDevelopment: beginDevelopment,
    write: write
  };
};
