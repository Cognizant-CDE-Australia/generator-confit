'use strict';

module.exports = function() {

  function write() {
    this.log('Writing NPM release options');

    let config = this.getConfig();
    let toolResources = this.buildTool.getResources().release;

    let semanticResources = toolResources.repositoryType[config.repositoryType][config.useSemantic ? 'semantic' : 'manual'];
    this.writeBuildToolConfig(semanticResources);

    let commitMessageResources = toolResources.commitMessageFormat[config.commitMessageFormat];
    this.writeBuildToolConfig(commitMessageResources);
  }

  return {
    write: write
  };
};
