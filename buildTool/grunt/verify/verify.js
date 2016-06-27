'use strict';
const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing Grunt verify options');

    // Write global verify config...
    let config = this.getGlobalConfig();
    let demoDir = this.getResources().sampleApp.demoDir;  // We want to ignore this directory when linting, initially!
    demoDir = this.renderEJS(demoDir, config);     // This can contain an EJS template, so parse it directly

    let toolResources = this.buildTool.getResources().verify;
    this.writeBuildToolConfig(toolResources, {demoDir: demoDir});

    // ...then sub-configs for cssCodingStandard and jsCodingStandard
    if (config.buildCSS && config.buildCSS.sourceFormat) {
      let cssCodingStandard = config.buildCSS.sourceFormat;
      this.writeBuildToolConfig(toolResources.cssCodingStandard[cssCodingStandard]);
    }

    if (config.verify.jsCodingStandard) {
      let jsCodingStandard = config.verify.jsCodingStandard;
      this.writeBuildToolConfig(toolResources.jsCodingStandard[jsCodingStandard]);
    }
  }

  return {
    write: write
  };
};
