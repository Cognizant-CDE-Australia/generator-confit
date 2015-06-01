module.exports = function() {
  'use strict';

  function write(gen) {
    var templates = gen.config.getAll();

    // Generate a file in %configDir/grunt called "gruntBuildHTML.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuildHTML.js'),
      gen.destinationPath('config/grunt/buildHTML.js'),
      templates
    );

    // Modify Package JSON
    gen.setNpmDevDependencies({
      'grunt-contrib-copy': '*',
      'grunt-targethtml': '*'
    });
  }

  return {
    write: write
  };
};
