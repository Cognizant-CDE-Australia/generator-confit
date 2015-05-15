module.exports = function() {
  'use strict';

  function write(gen, commonLib) {
    //gen.log('Writing "app" using GruntJS');

    gen.fs.copy(
      gen.templatePath('../grunt/templates/_Gruntfile.js'),
      gen.destinationPath('Gruntfile.js')
    );

    // Add the NPM dev dependencies
    commonLib.addNpmDevDependencies({
      'time-grunt': '*',
      'grunt-extend-config': '*',
      'load-grunt-tasks': '*'
    });
  }


  return {
    write: write
  };
};
