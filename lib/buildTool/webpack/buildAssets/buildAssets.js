'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack buildAssets options');
    let toolResources = this.buildTool.getResources().buildAssets;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write,
  };
};
