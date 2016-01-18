'use strict';

var _ = require('lodash');

module.exports = function() {

  // These two methods are really dangerous!
  // We use them because sampleApp has cross-cutting concerns, and needs to update the config of other generators.
  // Proceed with CAUTION!
  function readConfit() {
    return this.fs.readJSON(this.configFile);
  }

  function writeConfig(data) {
    this.fs.writeJSON(this.configFile, data);
  }


  function configuring() {
    // Generate a Webpack-specific version of the sample entry points
    var fullConfig = readConfit.apply(this);
    var config = fullConfig[this.ROOT_GENERATOR_NAME];
    var modulesDir = config.paths.input.modulesSubDir;

    // Add a sampleApp entryPoint
    if (!config.entryPoint.entryPoints) {
      config.entryPoint.entryPoints = {};
    }
    config.entryPoint.entryPoints.sampleApp = ['./' + modulesDir + this.demoOutputModuleDir + 'app.js'];

    // Add any vendor scripts to the config that the sampleApp for the selected framework needs
    var jsFrameworkConfig = this.buildTool.getResources().sampleApp.js.framework;
    var selectedFramework = config.buildJS.framework[0] || '';
    var vendorScripts = jsFrameworkConfig[selectedFramework].vendorScripts || [];

    // Deduplicate the array
    config.buildJS.vendorScripts = _.uniq(config.buildJS.vendorScripts.concat(vendorScripts.map(function(module) {
      return _.keys(module)[0];
    })));

    writeConfig.apply(this, [fullConfig]);
  }


  function write() {
    this.log('Writing Webpack sampleApp options');

    var config = this.getGlobalConfig();
    var paths = config.paths;
    var outputDir = paths.input.srcDir;
    var self = this;

    // Add the NPM dev dependencies
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().sampleApp.packages);

    // Read the framework config, as we need to know where the sample files for each framework live
    var jsFrameworkConfig = this.buildTool.getResources().sampleApp.js.framework;

    // Build the sample app using just the first framework (in case many are selected)
    var selectedFramework = config.buildJS.framework[0] || '';
    var selectedJSFrameworkDir = jsFrameworkConfig[selectedFramework].sampleDir;
    var vendorScripts = jsFrameworkConfig[selectedFramework].vendorScripts || [];

    // Add the CSSFile to the config, so that it can be require()'ed in Webpack
    config.$CSSFilePath = paths.input.stylesDir + this.CSSFile;

    // Copy JS files
    this.fs.copyTpl(this.toolTemplatePath(selectedJSFrameworkDir + this.demoOutputModuleDir + '*.js'), paths.input.modulesDir + this.demoOutputModuleDir, config);

    // Copy TEMPLATE HTML files
    this.fs.copy(this.toolTemplatePath(selectedJSFrameworkDir + this.demoOutputModuleDir + 'templates/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.templateDir);

    // Copy Webpack specific index.html template
    this.fs.copy(this.toolTemplatePath(selectedJSFrameworkDir + 'index-template.html'), this.destinationPath(outputDir + 'index-template.html'));

    vendorScripts.forEach(function(module) {
      self.setNpmDependencies(module);
    });
  }

  return {
    configure: configuring,
    write: write
  };
};
