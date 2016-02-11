'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildCSS options');

    var resources = this.buildTool.getResources().buildCSS;

    this.setNpmDevDependenciesFromArray(resources.packages);

    // Add the source-format specific CSS packages
    var config = this.getGlobalConfig();
    var cssSourceFormat = config.buildCSS.sourceFormat;
    this.setNpmDevDependenciesFromArray(resources.sourceFormat[cssSourceFormat].packages);
  }

  return {
    write: write
  };
};
