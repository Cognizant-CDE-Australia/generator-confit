'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing Codecept system-test options');
    let toolResources = this.buildTool.getResources().testSystem;

    this.writeBuildToolConfig(toolResources);
  }

  return {
    write: write,
  };
};
