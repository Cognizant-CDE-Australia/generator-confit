'use strict';

module.exports = function() {
  return {
    configure,
    write
  };
};

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
 * @param {Object} config     Configuration object to search for the selected JS Framework config
 * @return {Object}           JS Framework config
 * @this generator
 */
function getFrameworkConfig(config) {
  let jsSourceFormat = config.buildJS.sourceFormat;
  let selectedFramework = config.buildJS.framework[0] || '';
  let jsFrameworkConfig = this.getResources().buildJS.frameworks;

  return jsFrameworkConfig[selectedFramework][jsSourceFormat];
}

/**
 * @this generator
 */
function configure() {
  let config = readConfit.apply(this);
  let selectedFrameworkConfig = getFrameworkConfig.call(this, config);
  let templateData = this.getStandardTemplateData();

  // Make sure entryPoint.entryPoints is an object
  if (!config.entryPoint.entryPoints) {
    config.entryPoint.entryPoints = {};
  }

  // Change the entryPoint value to be the sampleApp's entryPoint
  config.entryPoint.entryPoints.main = [this.renderEJS(selectedFrameworkConfig.entryPointFileName, templateData)];

  writeConfit.call(this, config);
}

/**
 * @this generator
 */
function write() {
  this.log('Writing NPM sampleApp options');

  let toolResources = this.buildTool.getResources().sampleApp;

  this.writeBuildToolConfig(toolResources);
}
