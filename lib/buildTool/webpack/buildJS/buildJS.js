'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack buildJS options');
    // Source-format specific resources
    let sourceFormat = this.getConfig('sourceFormat');
    let toolResources = this.buildTool.getResources().buildJS.sourceFormat[sourceFormat];

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
