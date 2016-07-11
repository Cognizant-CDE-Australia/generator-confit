'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack serverDev options');
    var toolResources = this.buildTool.getResources().serverDev;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
