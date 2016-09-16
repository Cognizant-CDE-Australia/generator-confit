'use strict';
module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Webpack unit-test options');

    let toolResources = this.buildTool.getResources().testUnit;

    this.writeBuildToolConfig(toolResources);

    // Add the packages which are dependent on the JS sourceFormat
    let sourceFormat = this.getGlobalConfig().buildJS.sourceFormat;

    this.writeBuildToolConfig(toolResources.sourceFormat[sourceFormat]);
  }

  return {
    write: write
  };
};
