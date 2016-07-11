module.exports = function () {
  'use strict';

  function write() {
    this.log('Writing Grunt serverProd options');
    let toolResources = this.buildTool.getResources().serverProd;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};

