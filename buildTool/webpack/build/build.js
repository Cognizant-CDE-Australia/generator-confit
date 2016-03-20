'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack build options');

    var toolResources = this.buildTool.getResources().build;
    var isUnsupportedMessage = this.isBuildToolSupported(toolResources);
    this.addNpmTasks(toolResources.tasks, isUnsupportedMessage);
    this.setNpmDevDependenciesFromArray(toolResources.packages);
  }

  return {
    write: write
  };
};
