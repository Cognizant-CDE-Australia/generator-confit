module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt path options');

    var config = gen.getConfig();

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntPaths.js.tpl'),
      gen.destinationPath('config/grunt/paths.js'),
      config
    );

  }


  return {
    write: write
  };
};
