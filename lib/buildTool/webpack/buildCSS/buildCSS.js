'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack buildCSS options');
    let toolResources = this.buildTool.getResources().buildCSS;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
