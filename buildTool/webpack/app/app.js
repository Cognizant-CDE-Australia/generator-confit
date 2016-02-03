'use strict';

module.exports = function() {

  function write() {
    this.log('Writing "app" using Webpack');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().app.packages);
  }

  return {
    write: write
  };
};
