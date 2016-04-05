'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack app options');
    let toolResources = this.buildTool.getResources().app;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
