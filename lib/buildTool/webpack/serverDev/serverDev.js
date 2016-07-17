'use strict';

module.exports = function() {

  /**
   * @returns {undefined}
   * @this generator
   */
  function write() {
    this.log('Writing Webpack serverDev options');
    let toolResources = this.buildTool.getResources().serverDev;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
