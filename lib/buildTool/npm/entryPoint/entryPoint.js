'use strict';

module.exports = function() {
  return {
    configure,
    write,
  };
};

/**
 * @this generator
 */
function configure() {
  if (!this.answers.entryPoints) {
    this.answers.entryPoints = {};
  }

  if (!this.answers.entryPoints.main) {
    let config = this.getGlobalConfig();

    this.answers.entryPoints.main = [config.paths.input.srcDir + this.getResources().entryPoint.defaults.entryPoint[config.buildJS.sourceFormat]];
  }
}

/**
 * @this generator
 */
function write() {
  this.log('Writing NPM entryPoint options');
  let toolResources = this.buildTool.getResources().entryPoint;

  this.writeBuildToolConfig(toolResources);
}
