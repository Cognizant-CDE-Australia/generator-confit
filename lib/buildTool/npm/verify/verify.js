'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM verify options');
    let toolResources = this.buildTool.getResources().verify;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
