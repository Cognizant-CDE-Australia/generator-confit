'use strict';

module.exports = function() {

  function writeConfig(gen) {
    // Generate a Webpack-specific version of the sample entry points
    var config = gen.getGlobalConfig();
    var modulesDir = config.paths.input.modulesSubDir;

    gen.answers.sampleAppEntryPoint = {
      app: ['./' + modulesDir + gen.demoOutputModuleDir + 'app.js']
    };
  }


  function write(gen) {
    gen.log('Writing "sampleApp" using Webpack');

    var config = gen.getGlobalConfig();
    var paths = config.paths;
    var outputDir = paths.input.srcDir;

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'lodash': '*'
    });

    // Web-pack specific index.html template
    gen.fs.copy(gen.toolTemplatePath('index-template.html'), gen.destinationPath(outputDir + 'index-template.html'));

    // Copy the Webpack-specific, JS-framework-specific samples directory
    config.$CSSFilePath = paths.input.stylesDir + gen.CSSFile;
    gen.fs.copyTpl(gen.toolTemplatePath(gen.selectedJSFrameworkDir + gen.demoOutputModuleDir), paths.input.modulesDir + gen.demoOutputModuleDir, config);
  }

  return {
    writeConfig: writeConfig,
    write: write
  };
};
