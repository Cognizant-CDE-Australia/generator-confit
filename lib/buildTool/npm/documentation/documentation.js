'use strict';

module.exports = function() {
  /**
   * @this generator
   */
  function write() {
    this.log('Writing NPM documentation options');

    // Write global verify config...
    let config = this.getGlobalConfig();
    let docConfig = config.documentation;
    let toolResources = this.buildTool.getResources().documentation;

    // Create the common docs configuration
    this.writeBuildToolConfig(toolResources.common);

    // Create the publishMethod-specific configuration
    this.writeBuildToolConfig(toolResources[docConfig.publishMethod]);

    if (docConfig.createSampleDocs) {
      this.writeBuildToolConfig(toolResources.sampleDocs);

      // Then write the js-framework-specific documentation config, if a framework is selected
      let selectedFramework = config.buildJS.framework ? config.buildJS.framework[0] : '' || '';

      this.writeBuildToolConfig(toolResources.frameworks[selectedFramework]);
    }
  }

  return {
    write: write
  };
};
