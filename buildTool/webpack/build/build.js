'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack build options');
    let toolResources = this.buildTool.getResources().build;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
