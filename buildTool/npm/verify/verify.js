'use strict';
const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing NPM verify options');

    // Write global verify config...
    let config = this.getGlobalConfig();
    let resources = this.getResources().verify;
    let toolResources = this.buildTool.getResources().verify;

    // Evaluation-context for the codeConfig.codingStandardExpression
    let context = {
      config,
      resources
    };

    this.writeBuildToolConfig(toolResources);

    // For-each source-code-type to verify, write build tool config
    resources.codeToVerify.forEach(codeConfig => {
      //console.log(toolResources[codeConfig.configKey][_.get(context, codeConfig.codingStandardExpression)]);
      this.writeBuildToolConfig(toolResources[codeConfig.configKey][_.get(context, codeConfig.codingStandardExpression)]);
    });
  }

  return {
    write: write
  };
};
