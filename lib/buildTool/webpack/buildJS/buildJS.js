'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack buildJS options');

    let toolResources = this.buildTool.getResources().buildJS;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write,
  };
};
