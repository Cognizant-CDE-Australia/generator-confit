'use strict';
const _ = require('lodash');

module.exports = function() {
  return {
    configure,
    write
  };
};

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
  let fullConfig = readConfit.apply(this);
  let config = fullConfig[this.getResources().rootGeneratorName];
  let demoOutputModuleDir = this.renderEJS(this.getResources().sampleApp.demoDir, config);

  // Add a sampleApp entryPoint
  if (!config.entryPoint.entryPoints) {
    config.entryPoint.entryPoints = {};
  }

  // Get the sourceFormat, to use the appropriate entryPoint file name
  let selectedFrameworkConfig = getFrameworkConfig.call(this, config);

  config.entryPoint.entryPoints.main = this.renderEJS(selectedFrameworkConfig.entryPointFileName, config);

  writeConfit.apply(this, [fullConfig]);
}

function write() {
  this.log('Writing NPM sampleApp options');

  let config = this.getGlobalConfig();
  let selectedFrameworkConfig = getFrameworkConfig.call(this, config);

  this.writeBuildToolConfig(selectedFrameworkConfig);
}
