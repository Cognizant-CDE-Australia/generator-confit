'use strict';
const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing Grunt verify options');

    // Write global verify config...
    let toolResources = this.buildTool.getResources().verify;
    this.writeBuildToolConfig(toolResources);

    // ...then sub-configs for cssCodingStandard and jsCodingStandard
    let config = this.getGlobalConfig();
    let cssCodingStandard = config.buildCSS.sourceFormat;
    let jsCodingStandard = config.verify.jsCodingStandard;

    this.writeBuildToolConfig(toolResources.cssCodingStandard[cssCodingStandard]);
    this.writeBuildToolConfig(toolResources.jsCodingStandard[jsCodingStandard]);
  }

  return {
    write: write
  };
};
