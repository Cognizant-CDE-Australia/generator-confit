'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildCSS options');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().buildCSS.packages);
  }

  return {
    write: write
  };
};
