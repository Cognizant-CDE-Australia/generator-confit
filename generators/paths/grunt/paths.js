module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt path options');

    var templates = gen.config.get('paths');

    //gen.log(templates);

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntPaths.js'),
      gen.destinationPath('config/grunt/paths.js'),
      templates
    );
  }


  return {
    write: write
  };
};
