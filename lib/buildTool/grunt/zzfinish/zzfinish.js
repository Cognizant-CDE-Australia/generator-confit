module.exports = function () {
  'use strict';

  function write() {
    this.log('Writing Grunt finish options');
    let toolResources = this.buildTool.getResources().zzfinish;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};

