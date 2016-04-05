'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildHTML options');
    let toolResources = this.buildTool.getResources().buildHTML;
    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
