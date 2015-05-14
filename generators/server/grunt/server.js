module.exports = function() {
  'use strict';

  function write(gen, common) {
    gen.log('Writing grunt serve options');

    var templates = gen.config.get('server');

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntServe.js'),
      gen.destinationPath('config/grunt/serve.js'),
      templates
    );

    // Modify Package JSON to use grunt-connect
    // serverName - The name of the grunt-connect server
    // baseDir -

    // Create a new section in the file based on the responses


    // Update the generator config.
    gen.config.set('baseDir', this.baseDir);   // This isn't a perfect example... it really represents 'the last-specified baseDir', rather than the 'global baseDir'.
  }

  return {
    write: write
  };
};

