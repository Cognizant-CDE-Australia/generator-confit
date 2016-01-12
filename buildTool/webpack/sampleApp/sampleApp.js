'use strict';

module.exports = function() {

  function configuring() {
    // Generate a Webpack-specific version of the sample entry points
    var config = this.getGlobalConfig();
    var modulesDir = config.paths.input.modulesSubDir;

    this.answers.sampleAppEntryPoint = {
      app: ['./' + modulesDir + this.demoOutputModuleDir + 'app.js']
    };
  }


  function write() {
    this.log('Writing Webpack sampleApp options');

    var config = this.getGlobalConfig();
    var paths = config.paths;
    var outputDir = paths.input.srcDir;

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'lodash': '*'
    });

    // Web-pack specific index.html template
    this.fs.copy(this.toolTemplatePath('index-template.html'), this.destinationPath(outputDir + 'index-template.html'));

    // Copy the Webpack-specific, JS-framework-specific samples directory
    config.$CSSFilePath = paths.input.stylesDir + this.CSSFile;
    this.fs.copyTpl(this.toolTemplatePath(this.selectedJSFrameworkDir + this.demoOutputModuleDir), paths.input.modulesDir + this.demoOutputModuleDir, config);
  }

  return {
    configure: configuring,
    write: write
  };
};
