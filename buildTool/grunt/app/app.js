module.exports = function() {
  'use strict';

  function write(gen) {
    //gen.log('Writing "app" using GruntJS');

    gen.fs.copy(
      gen.toolTemplatePath('_Gruntfile.js'),
      gen.destinationPath('Gruntfile.js')
    );

    //copy utils file for grunt projects
    gen.fs.copy(
      gen.toolTemplatePath('_utils.js'),
      gen.destinationPath('config/grunt/lib/utils.js')
    );

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'time-grunt': '*',
      'grunt-extend-config': '*',
      'load-grunt-tasks': '*'
    });
  }

  function beginDevelopment(gen) {
    // This command is meant to start the development environment after installation has completed.
    if (!gen.options['skip-run']) {
      gen.spawnCommand('grunt', ['dev', '--url=index.html']);
    }
  }


  return {
    beginDevelopment: beginDevelopment,
    write: write
  };
};
