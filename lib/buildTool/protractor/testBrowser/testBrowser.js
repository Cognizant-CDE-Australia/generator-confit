'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Protractor browser-test options');
    let toolResources = this.buildTool.getResources().testBrowser;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
