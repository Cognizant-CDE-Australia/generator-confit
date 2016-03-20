module.exports = function () {
  'use strict';

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt serverDev options');

    var config = this.getConfig();

    this.fs.copyTpl(
      this.toolTemplatePath('serverDev.js.tpl'),
      this.destinationPath(config.paths.config.configDir + 'grunt/serverDev.js'),
      config
    );

    var toolResources = this.buildTool.getResources().serverDev;
    this.addNpmTasks(toolResources.tasks);
    this.setNpmDevDependenciesFromArray(toolResources.packages);
  }

  return {
    write: write
  };
};

