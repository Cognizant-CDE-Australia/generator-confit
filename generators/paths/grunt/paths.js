module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt path options');

    var config = gen.config.get('paths');

    //gen.log(templates);

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntPaths.js'),
      gen.destinationPath('config/grunt/paths.js'),
      config
    );

  }


  return {
    write: write
  };
};
