'use strict';
const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing NPM serverProd options');

    let toolResources = this.buildTool.getResources().serverProd;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write
  };
};
