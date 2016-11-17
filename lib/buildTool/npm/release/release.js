'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM release options');
    let toolResources = this.buildTool.getResources().release;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write,
  };
};
