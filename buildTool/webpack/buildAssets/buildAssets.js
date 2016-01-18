'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildAssets options');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().buildAssets.packages);
  }

  return {
    write: write
  };
};
