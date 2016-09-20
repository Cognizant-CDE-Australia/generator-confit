'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM testVisualRegression options');
    let toolResources = this.buildTool.getResources().testVisualRegression;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
