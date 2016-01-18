'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildHTML options');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().buildHTML.packages);
  }

  return {
    write: write
  };
};
