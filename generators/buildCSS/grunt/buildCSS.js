module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt CSS build options');

    var config = gen.getGlobalConfig();

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuildCSS.js.tpl'),
      gen.destinationPath('config/grunt/buildCSS.js'),
      config
    );

    // Modify Package JSON
    var compilerConfig = gen.compilerDB[config.buildCSS.cssCompiler];
    if (compilerConfig.gruntPackage) {
      gen.addNpmDevDependencies(compilerConfig.gruntPackage);
    }

    if (config.buildCSS.autoprefixer === true) {
      gen.addNpmDevDependencies({'grunt-autoprefixer': '*'});
    }
  }


  return {
    write: write
  };
};
