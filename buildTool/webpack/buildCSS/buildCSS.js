'use strict';

var _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildCSS options');

    var packages = this.buildTool.getResources().buildCSS.packages;
    this.setNpmDevDependenciesFromArray(packages);
  }

  return {
    write: write
  };
};
