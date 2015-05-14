module.exports = function() {
  'use strict';

  function write(gen, common) {
    gen.log('Writing grunt serve options');

    var templates = gen.config.getAll();

    //console.log(JSON.stringify(templates));
    console.log(JSON.stringify(templates.paths));

    // Generate a file in %configDir/grunt called "gruntBuildHTML.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuildHTML.js'),
      gen.destinationPath('config/grunt/buildHTML.js'),
      templates
    );

    // Modify Package JSON
    //common.addNpmDevDependencies({
    //  'grunt-contrib-watch': '*',
    //  'grunt-contrib-connect': '*'
    //});

    // Create a new section in the file based on the responses
    // Update the generator config.
    // gen.config.set('baseDir', this.baseDir);   // This isn't a perfect example... it really represents 'the last-specified baseDir', rather than the 'global baseDir'.
  }

  return {
    write: write
  };
};
