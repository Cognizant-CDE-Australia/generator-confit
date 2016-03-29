'use strict';

const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing Webpack unit-test options');

    var toolResources = this.buildTool.getResources().testUnit;
    this.setNpmDevDependenciesFromArray(toolResources.packages);
    this.addNpmTasks(toolResources.tasks);
    this.ts.addTypeLibsFromArray(toolResources.typeLibs);

    // Add the packages which are dependent on the JS sourceFormat
    var sourceFormat = this.getGlobalConfig().buildJS.sourceFormat;
    var sourceFormatDependencies = toolResources.sourceFormat[sourceFormat].packages;
    this.setNpmDevDependenciesFromArray(sourceFormatDependencies);


    // Merge all-the-things into a data object for use by our templates
    var config = _.merge({}, this.getGlobalConfig(), {
      buildTool: this.buildTool.getResources(),
      resources: this.getResources()
    });

    var outputDir = config.paths.config.configDir + 'testUnit/';

    this.updateJSFile(this.toolTemplatePath('karma.conf.js'), this.destinationPath(outputDir + 'karma.conf.js'), config);
    this.updateJSFile(this.toolTemplatePath('karma.debug.conf.js'), this.destinationPath(outputDir + 'karma.debug.conf.js'), config);
    this.updateJSFile(this.toolTemplatePath('karma.common.js.tpl'), this.destinationPath(outputDir + 'karma.common.js'), config);
    this.updateJSFile(this.toolTemplatePath('test.files.js.tpl'), this.destinationPath(outputDir + 'test.files.js'), config);

    this.addReadmeDoc('extensionPoint.testUnit', this.buildTool.getResources().readme.extensionPoint.testUnit);
  }

  return {
    write: write
  };
};
