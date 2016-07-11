'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Protractor browser-test options');
    var toolResources = this.buildTool.getResources().testBrowser;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
