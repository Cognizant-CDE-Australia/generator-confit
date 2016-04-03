'use strict';

module.exports = function() {
  let toolResources = this.buildTool.getResources().init;
  this.writeBuildToolConfig(toolResources);
};
