module.exports = function() {
  'use strict';

  function write(gen) {
    //gen.log('Writing "app" using GruntJS');

    gen.fs.copy(
      gen.toolTemplatePath('../../app/templates/_Gruntfile.js'),
      gen.destinationPath('Gruntfile.js')
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
