'use strict';

const _ = require('lodash');
let demoOutputModuleDir;    // We only want to calculate this once

module.exports = function() {

  // These two methods are really dangerous!
  // We use them because sampleApp has cross-cutting concerns, and needs to update the config of other generators.
  // Proceed with CAUTION!
  function readConfit() {
    return this.fs.readJSON(this.configFile);
  }

  function writeConfit(data) {
    this.fs.writeJSON(this.configFile, data);
  }


  function configure() {
    // Generate a Webpack-specific version of the sample entry points
    let fullConfig = readConfit.apply(this);
    let config = fullConfig[this.getResources().rootGeneratorName];
    demoOutputModuleDir = this.renderEJS(this.getResources().sampleApp.demoDir, config);

    // Add a sampleApp entryPoint
    if (!config.entryPoint.entryPoints) {
      config.entryPoint.entryPoints = {};
    }

    // Get the sourceFormat, to use the appropriate extension for the entry point
    var entryPointFileName = this.getResources().sampleApp.entryPointFileName[config.buildJS.sourceFormat];
    config.entryPoint.entryPoints.sampleApp = ['./' + demoOutputModuleDir + entryPointFileName];

    // Get the sampleApp's JS Framework config
    var jsFrameworkConfig = this.buildTool.getResources().sampleApp.js.framework;
    var selectedFrameworkConfig = jsFrameworkConfig[config.buildJS.framework[0] || ''] || {};

    // Add any vendor scripts that the sampleApp for the selected framework needs
    var vendorScripts = (selectedFrameworkConfig.vendorScripts || []).map((pkg) => pkg.name);
    config.buildJS.vendorScripts = _.uniq((config.buildJS.vendorScripts || []).concat(vendorScripts));

    // Add any TEST vendor scripts to the testUnit config form the selectedFrameworkConfig
    var testVendorScripts = (selectedFrameworkConfig.testVendorScripts || []).map((pkg) => pkg.name);
    config.testUnit.testDependencies = _.uniq(config.testUnit.testDependencies.concat(testVendorScripts));

    writeConfit.apply(this, [fullConfig]);
  }


  function write() {
    this.log('Writing Webpack sampleApp options');

    // Sample is the most complicated buildTool...
    var config = this.getGlobalConfig();
    var paths = config.paths;
    var outputDir = paths.input.srcDir;

    // Read the framework config, as we need to know where the sample files for each framework live
    var jsFrameworkConfig = this.buildTool.getResources().sampleApp.js.framework;

    // Build the sample app using just the first framework (in case many are selected)
    var sourceFormat = config.buildJS.sourceFormat;
    var selectedFramework = config.buildJS.framework[0] || '';
    var selectedFrameworkConfig = jsFrameworkConfig[selectedFramework];
    var selectedJSFrameworkDir = selectedFrameworkConfig.sampleDir + sourceFormat + '/'; // e.g. ng1/ES6/

    // Add the NPM dev dependencies (for the build tools) and the runtime dependencies
    this.setNpmDependenciesFromArray(selectedFrameworkConfig.vendorScripts);
    this.ts.addTypeLibsFromArray(selectedFrameworkConfig.typeLibs);
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().sampleApp.packages);

    // Add the $CSSEntryPoints to the config, so that it can be require()'ed in Webpack
    config.$CSSEntryPoints = this.CSSEntryPointFiles.map(file => paths.input.stylesDir + file);

    // Copy JS files
    this.fs.copyTpl(
      this.getToolTemplatePath(selectedJSFrameworkDir + 'demoModule/*.*'),
      this.destinationPath(paths.input.srcDir + demoOutputModuleDir),
      config
    );

    // Copy unit test(s)
    this.fs.copy(
      this.getToolTemplatePath(selectedJSFrameworkDir + 'demoModule/unitTest/*.*'),
      this.destinationPath(paths.input.srcDir + demoOutputModuleDir + paths.input.unitTestDir)
    );


    // Copy TEMPLATE HTML files
    this.fs.copy(
      this.getToolTemplatePath(selectedJSFrameworkDir + 'demoModule/templates/*.*'),
      this.destinationPath(paths.input.srcDir + demoOutputModuleDir + paths.input.templateDir)
    );

    // Copy Webpack specific index.html template
    this.fs.copy(
      this.getToolTemplatePath(selectedJSFrameworkDir + '*.*'),
      this.destinationPath(outputDir)
    );
  }

  return {
    configure,
    write
  };
};
