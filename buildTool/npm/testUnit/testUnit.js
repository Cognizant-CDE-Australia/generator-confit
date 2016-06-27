'use strict';

module.exports = function() {

  function write() {
    this.log('Writing NPM testUnit options');

    let toolResources = this.buildTool.getResources().testUnit;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
