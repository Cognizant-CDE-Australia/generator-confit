'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildJS options');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().buildJS.packages);
  }

  return {
    write: write
  };
};
