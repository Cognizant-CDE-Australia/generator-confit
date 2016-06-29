'use strict';

module.exports = function() {
  return {
    configure,
    write
  };
};


function configure() {
  console.log(this.answers);
  if (!this.answers.entryPoints.main) {
    let config = this.getGlobalConfig();
    this.answers.entryPoints.main = config.paths.input.srcDir + this.getResources().entryPoint.defaultEntryPointFileName[config.buildJS.sourceFormat];
  }
}


function write() {
  this.log('Writing NPM entryPoint options');
  let toolResources = this.buildTool.getResources().entryPoint;

  // Update the toolResources.packageJsonConfig.main property with the entryPoint value

  toolResources.packageJsonConfig.main = this.getConfig().entryPoints;

  this.writeBuildToolConfig(toolResources);
}
