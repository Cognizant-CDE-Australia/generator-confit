'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM serverProd options');
    let toolResources = this.buildTool.getResources().serverProd;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
