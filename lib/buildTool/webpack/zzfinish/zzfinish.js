'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack finish options');
    let toolResources = this.buildTool.getResources().zzfinish;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
