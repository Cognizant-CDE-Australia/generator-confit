module.exports = function () {
  'use strict';

  function write() {
    this.log('Writing Grunt serverDev options');
    let toolResources = this.buildTool.getResources().serverDev;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};

