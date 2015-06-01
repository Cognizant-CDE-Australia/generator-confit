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
    var compiler = config.buildCSS.cssCompiler;
    gen.setNpmDevDependencies({'grunt-contrib-stylus': '*'}, compiler === 'stylus');
    gen.setNpmDevDependencies({'grunt-contrib-sass': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'grunt-autoprefixer': '*'}, config.buildCSS.autoprefixer === true);
  }


  return {
    write: write
  };
};
