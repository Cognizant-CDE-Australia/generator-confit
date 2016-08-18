'use strict';
module.exports = function() {

  /**
   * @returns {undefined}
   * @this generator
   */
  function write() {
    this.log('Writing CSS Regression tests configuration');

    let toolResources = this.buildTool.getResources().cssRegression;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
