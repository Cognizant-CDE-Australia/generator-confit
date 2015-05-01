module.exports = function() {
  'use strict';

  function write(gen, commonLib) {
    gen.log('Writing grunt path options');

    var templates = {
      input: {
        srcDir: commonLib.getConfig('input.srcDir'),
        modulesDir: commonLib.getConfig('input.modulesDir'),
        assetsDir: commonLib.getConfig('input.assetsDir')
      }
    };

    gen.log(templates);
    //gen.log(commonLbi);

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntPaths.js'),
      gen.destinationPath('config/grunt/paths.js'),
      templates
    );

  };


  return {
    write: write
  };
};
