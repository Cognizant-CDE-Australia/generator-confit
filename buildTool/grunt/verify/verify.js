'use strict';
var _ = require('lodash');

module.exports = function() {

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt verify options');

    var config = this.config.getAll();
    var outputDir = config.paths.config.configDir;

    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().verify.packages);

    this.fs.copyTpl(
      this.toolTemplatePath('gruntVerify.js.tpl'),
      this.destinationPath(outputDir + 'grunt/verify.js'),
      config
    );

    // Define the verify tasks
    this.defineNpmTask('verify', ['grunt verify'], 'Verify JS & CSS code style and syntax');
    this.defineNpmTask('verify:watch', ['grunt watch:verify'], 'Run verify task whenever JS or CSS code changes');
  }

  return {
    write: write
  };
};
