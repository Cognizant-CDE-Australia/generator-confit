'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM release options');

    let config = this.getConfig();
    let repoType = this.getGlobalConfig().app.repositoryType;
    let toolResources = this.buildTool.getResources().release;
    let semanticResources = toolResources.repositoryType[repoType][config.useSemantic ? 'semantic' : 'manual'];
    let commitMessageResources = toolResources.commitMessageFormat[config.commitMessageFormat];

    this.writeBuildToolConfig(semanticResources);
    this.writeBuildToolConfig(commitMessageResources);
  }

  return {
    write: write
  };
};
