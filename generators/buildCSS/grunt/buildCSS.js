module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt CSS build options');

    var templates = gen.config.getAll();

    //gen.log(templates);
    //console.log(templates.buildCSS);
    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuildCSS.js'),
      gen.destinationPath('config/grunt/buildCSS.js'),
      templates
    );
  }


  return {
    write: write
  };
};
