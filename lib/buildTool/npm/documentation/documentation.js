'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM documentation options');

    let toolResources = this.buildTool.getResources().documentation;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write,
  };
};
