'use strict';

module.exports = function() {

  /**
   * @returns {undefined}
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
