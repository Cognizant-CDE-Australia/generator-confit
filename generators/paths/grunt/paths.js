module.exports = function() {
  'use strict';

  function write(gen, common) {
    gen.log('Writing grunt path options');

    var config = common.getConfig();

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
