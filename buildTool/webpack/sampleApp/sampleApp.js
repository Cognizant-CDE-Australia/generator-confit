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


    var frameworkSampleAppDir = {
      '': 'es6/',
      'AngularJS 1.x': 'es6ng1/',
      'AngularJS 2.x': 'es6ng2/',     // Not yet implemented
      'React (latest)': 'es6react/'   // Not yet implemented
    };

    // Build the sample app using just the first framework (in case many are selected)
    var selectedFramework = config.buildJS.framework[0] || '';
    this.selectedJSFrameworkDir = frameworkSampleAppDir[selectedFramework];

    // Add the CSSFile to the config, so that it can be require()'ed in Webpack
    config.$CSSFilePath = paths.input.stylesDir + this.CSSFile;

    // Copy JS files
    this.fs.copyTpl(this.toolTemplatePath(this.selectedJSFrameworkDir + this.demoOutputModuleDir + '*.js'), paths.input.modulesDir + this.demoOutputModuleDir, config);

    // Copy TEMPLATE HTML files
    this.fs.copy(this.toolTemplatePath(this.selectedJSFrameworkDir + this.demoOutputModuleDir + 'templates/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.templateDir);

    // Copy Webpack specific index.html template
    this.fs.copy(this.toolTemplatePath(this.selectedJSFrameworkDir + 'index-template.html'), this.destinationPath(outputDir + 'index-template.html'));

  }

  return {
    configure: configuring,
    write: write
  };
};
