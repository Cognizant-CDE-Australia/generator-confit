'use strict';
const _ = require('lodash');

module.exports = function() {
  // These two methods are really dangerous!
  // We use them because sampleApp has cross-cutting concerns, and needs to update the config of other generators.
  // Proceed with CAUTION!
  /**
   * @return {Object}  JSON object
   * @this generator
   */
  function readConfit() {
    return this.config._store();
  }

  /**
   * @param {Object} data     Object to convert to JSON
   * @this generator
   */
  function writeConfit(data) {
    this.config._persist(data);
  }

  /**
   * Gets the framework configuration for the current generator config. Note that this
   * is the actual framework configuration, NOT whether the framework has a sample object.
   *
   * @param {Object} config     Configuration object to search for the selected JS Framework config
   * @return {Object}          JS Framework config
   * @this generator
   */
  function getFrameworkConfig(config) {
    let selectedFramework = config.buildJS.framework[0] || '';
    let resources = this.getResources().frameworks[selectedFramework];

    return resources;
  }

  /**
   * Generate a Webpack-specific version of the sample entry points.
   * This requires modifying the config of OTHER GENERATORS!
   *
   * @this generator
   */
  function configure() {
    let config = readConfit.apply(this);
    let selectedFramework = config.buildJS.framework[0] || '';
    let selectedFrameworkConfig = getFrameworkConfig.call(this, config);
    let templateData = this.getStandardTemplateData();
    let sourceFormat = config.buildJS.sourceFormat;

    // Add a sampleApp entryPoint
    if (!config.entryPoint.entryPoints) {
      config.entryPoint.entryPoints = {};
    }

    // Get the sampleApp's JS Framework config
    let entryPointFileName = this.renderEJS(selectedFrameworkConfig[sourceFormat].entryPointFileName, templateData);

    config.entryPoint.entryPoints.sampleApp = [entryPointFileName];


    // Initialise the vendor scripts with the names of the framework packages.
    let vendorScripts = (selectedFrameworkConfig.frameworkPackages.packages || []).map((pkg) => pkg.name);

    // Then add any vendor scripts for the sampleApp for the selected framework
    let sampleAppVendorScripts = this.buildTool.getResources().sampleApp.frameworks[selectedFramework][sourceFormat].vendorScripts;

    if (sampleAppVendorScripts) {
      vendorScripts = [].concat(
        sampleAppVendorScripts.pre || [],
        vendorScripts,
        sampleAppVendorScripts.post || []
      );
    }

    config.buildJS.vendorScripts = _.uniq((config.buildJS.vendorScripts || []).concat(vendorScripts));

    // Add any TEST vendor scripts to the testUnit config from the selectedFrameworkConfig
    let testVendorScripts = (selectedFrameworkConfig.frameworkPackages.testPackages || []).map((pkg) => pkg.name);

    config.testUnit.testDependencies = _.uniq((config.testUnit.testDependencies || []).concat(testVendorScripts));

    writeConfit.call(this, config);
  }

  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack sampleApp options');

    let toolResources = this.buildTool.getResources().sampleApp;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    configure,
    write,
  };
};
