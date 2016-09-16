'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack buildBrowser options');
    let toolResources = this.buildTool.getResources().buildBrowser;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
