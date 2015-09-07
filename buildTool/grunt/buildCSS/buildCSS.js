module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt CSS build options');

    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;
    var compiler = config.buildCSS.cssCompiler;

    // If the entrypoint contains one-or-more source-CSS files, make the first one we find the buildCSS.entryCSSFile
    var entryPoints = config.entryPoint.entryPoints;
    var templateExt = gen.cssCompilerConfig[compiler].ext;
    for (var key in entryPoints) {
      for (var i = 0; i < entryPoints[key].length; i++) {
        if (entryPoints[key][i].indexOf(templateExt) > -1) {
          config.buildCSS.entryCSSFile = entryPoints[key][i];
          break;
        }
      }
    }

    // If we don't have an actual entry CSS file, use the template file instead
    if (!config.buildCSS.entryCSSFile) {
      config.buildCSS.entryCSSFile = gen.cssCompilerConfig[compiler].template;
    }
    //console.dir(config.buildCSS);


    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntBuildCSS.js.tpl'),
      gen.destinationPath(outputDir + 'grunt/buildCSS.js'),
      config
    );

    // Modify Package JSON

    gen.setNpmDevDependencies({'grunt-contrib-stylus': '*'}, compiler === 'stylus');
    gen.setNpmDevDependencies({'grunt-contrib-sass': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'grunt-autoprefixer': '*'}, config.buildCSS.autoprefixer === true);
  }


  return {
    write: write
  };
};
