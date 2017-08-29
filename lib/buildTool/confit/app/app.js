'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing App library');
    let toolResources = this.buildTool.getResources().app;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write,
  };
};
