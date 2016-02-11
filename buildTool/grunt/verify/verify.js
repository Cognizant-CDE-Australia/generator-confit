'use strict';
var _ = require('lodash');

module.exports = function() {

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt verify options');

    var config = this.config.getAll();
    var outputDir = config.paths.config.configDir;
    var toolResources = this.buildTool.getResources().verify;
    var cssCodingStandard = config.buildCSS.sourceFormat;
    var jsCodingStandard = config.verify.jsCodingStandard;
    var packages = [].concat(
      toolResources.packages,
      toolResources.cssCodingStandard[cssCodingStandard].packages,
      toolResources.jsCodingStandard[jsCodingStandard].packages
    );
    this.setNpmDevDependenciesFromArray(packages);

    var demoModuleDir = this.getResources().sampleApp.demoModuleDir;  // We want to ignore this directory when linting!  // TODO: Do this in the sample app?
    var templateData = _.merge({}, config, {resources: this.getResources()});
    this.fs.copyTpl(
      this.toolTemplatePath('gruntVerify.js.tpl'),
      this.destinationPath(outputDir + 'grunt/verify.js'),
      templateData
    );

    // Define the verify tasks
    this.defineNpmTask('verify', ['grunt verify'], 'Verify JS & CSS code style and syntax');
    this.defineNpmTask('verify:watch', ['grunt watch:verify'], 'Run verify task whenever JS or CSS code changes');
  }

  return {
    write: write
  };
};
