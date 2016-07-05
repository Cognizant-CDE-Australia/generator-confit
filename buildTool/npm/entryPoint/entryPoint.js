'use strict';

module.exports = function() {
  return {
    configure,
    write
  };
};


function configure() {
  if (!this.answers.entryPoints.main) {
    let config = this.getGlobalConfig();
    this.answers.entryPoints.main = [config.paths.input.srcDir + this.getResources().entryPoint.defaultEntryPointFileName[config.buildJS.sourceFormat]];
  }
}


function write() {
  this.log('Writing NPM entryPoint options');
  let toolResources = this.buildTool.getResources().entryPoint;

  this.writeBuildToolConfig(toolResources);
}
