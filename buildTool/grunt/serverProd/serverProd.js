module.exports = function () {
  'use strict';

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt serverProd options');

    var config = this.getGlobalConfig();

    this.fs.copyTpl(
      this.toolTemplatePath('serverProd.js.tpl'),
      this.destinationPath(config.paths.config.configDir + 'grunt/serverProd.js'),
      config
    );

    var toolResources = this.buildTool.getResources().serverProd;
    this.addNpmTasks(toolResources.tasks);
    this.setNpmDevDependenciesFromArray(toolResources.packages);
  }

  return {
    write: write
  };
};

