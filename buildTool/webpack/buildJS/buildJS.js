'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildJS options');

    var sourceFormat = this.getConfig('sourceFormat');
    var sourceFormatDependencies = this.buildTool.getResources().buildJS.sourceFormat[sourceFormat].packages;

    this.setNpmDevDependenciesFromArray(sourceFormatDependencies);
  }

  return {
    write: write
  };
};
