'use strict';

module.exports = function() {
  /**
   * @returns {undefined}
   * @this generator
   */
  function write() {
    this.log('Writing Webpack buildCSS options');
    let toolResources = this.buildTool.getResources().buildCSS;

    this.writeBuildToolConfig(toolResources);

    // Add the source-format specific config
    let config = this.getGlobalConfig();
    let cssSourceFormat = config.buildCSS.sourceFormat;

    this.writeBuildToolConfig(toolResources.sourceFormat[cssSourceFormat]);
  }

  return {
    write: write
  };
};
