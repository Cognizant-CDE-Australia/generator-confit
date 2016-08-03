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
 * @returns {Object}  JSON object
 * @this generator
 */
function readConfit() {
  return this.config._store();
}

/**
 * @param {Object} data     Object to convert to JSON
 * @returns {Object}        JSON object
 * @this generator
 */
function writeConfit(data) {
  this.config._persist(data);
}

/**
 * @param {Object} config     Configuration object to search for the selected JS Framework config
 * @returns {Object}          JS Framework config
 * @this generator
 */
function getFrameworkConfig(config) {
  let jsFrameworkConfig = this.buildTool.getResources().sampleApp.js.framework;
  let sourceFormat = config.buildJS.sourceFormat;
  let selectedFramework = config.buildJS.framework[0] || '';

  return (jsFrameworkConfig[selectedFramework] || {sourceFormat: {}}).sourceFormat[sourceFormat];
}

/**
 * @returns {undefined}
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

  config.entryPoint.entryPoints.main = [this.renderEJS(selectedFrameworkConfig.entryPointFileName, templateData)];

  writeConfit.call(this, config);
}

/**
 * @returns {undefined}
 * @this generator
 */
function write() {
  this.log('Writing NPM sampleApp options');

  let config = this.getGlobalConfig();
  let selectedFrameworkConfig = getFrameworkConfig.call(this, config);

  this.writeBuildToolConfig(selectedFrameworkConfig);
}
