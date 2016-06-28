'use strict';
const _ = require('lodash');

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

  function getFrameworkConfig(config) {
    let jsFrameworkConfig = this.buildTool.getResources().sampleApp.js.framework;
    let sourceFormat = config.buildJS.sourceFormat;
    let selectedFramework = config.buildJS.framework[0] || '';
    return (jsFrameworkConfig[selectedFramework] || {sourceFormat: {}}).sourceFormat[sourceFormat];
  }


  function configure() {
    // Generate a Webpack-specific version of the sample entry points.
    // This requires modifying the config of OTHER GENERATORS!

    let fullConfig = readConfit.apply(this);
    let config = fullConfig[this.getResources().rootGeneratorName];
    let demoOutputModuleDir = this.renderEJS(this.getResources().sampleApp.demoDir, config);

    // Add a sampleApp entryPoint
    if (!config.entryPoint.entryPoints) {
      config.entryPoint.entryPoints = {};
    }

    // Get the sampleApp's JS Framework config
    let selectedFrameworkConfig = getFrameworkConfig.call(this, config);
    // Get the sourceFormat, to use the appropriate entryPoint file name
    let sourceFormat = config.buildJS.sourceFormat;
    let entryPointFileName = this.getResources().sampleApp.entryPointFileName[sourceFormat];

    config.entryPoint.entryPoints.sampleApp = ['./' + demoOutputModuleDir + entryPointFileName];

    // Add any vendor scripts that the sampleApp for the selected framework needs
    let vendorScripts = (selectedFrameworkConfig.packages || []).map((pkg) => pkg.name);
    config.buildJS.vendorScripts = _.uniq((config.buildJS.vendorScripts || []).concat(vendorScripts));

    // Add any TEST vendor scripts to the testUnit config form the selectedFrameworkConfig
    let testVendorScripts = (selectedFrameworkConfig.testPackages || []).map((pkg) => pkg.name);
    config.testUnit.testDependencies = _.uniq(config.testUnit.testDependencies.concat(testVendorScripts));

    writeConfit.apply(this, [fullConfig]);
  }


  function write() {
    this.log('Writing Webpack sampleApp options');

    let config = this.getGlobalConfig();
    let selectedFrameworkConfig = getFrameworkConfig.call(this, config);

    this.writeBuildToolConfig(selectedFrameworkConfig);
  }

  return {
    configure,
    write
  };
};
