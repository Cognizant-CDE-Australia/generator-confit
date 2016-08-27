'use strict';

module.exports = function() {

  /**
   * @returns {undefined}
   * @this generator
   */
  function write() {
    this.log('Writing NPM documentation options');

    // Write global verify config...
    let config = this.getConfig();
    let toolResources = this.buildTool.getResources().documentation;

    // Create the common docs configuration
    this.writeBuildToolConfig(toolResources.common);

    // Create the publishMethod-specific configuration
    this.writeBuildToolConfig(toolResources[config.publishMethod]);

    if (config.createSampleDocs) {
      this.writeBuildToolConfig(toolResources.sampleDocs);
    }
  }

  return {
    write: write
  };
};
