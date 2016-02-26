'use strict';

const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing Webpack unit-test options');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().testUnit.packages);
    this.ts.addTypeLibsFromArray(this.buildTool.getResources().testUnit.typeLibs);

    // Merge all-the-things into a data object for use by our templates
    var config = _.merge({}, this.getGlobalConfig(), {
      buildTool: this.buildTool.getResources(),
      resources: this.getResources()
    });

    var outputDir = config.paths.config.configDir + 'testUnit/';

    this.updateJSFile.call(this, this.toolTemplatePath('karma.conf.js'), this.destinationPath(outputDir + 'karma.conf.js'), config);
    this.updateJSFile.call(this, this.toolTemplatePath('karma.debug.conf.js'), this.destinationPath(outputDir + 'karma.debug.conf.js'), config);
    this.updateJSFile.call(this, this.toolTemplatePath('karma.common.js.tpl'), this.destinationPath(outputDir + 'karma.common.js'), config);
    this.updateJSFile.call(this, this.toolTemplatePath('test.files.js.tpl'), this.destinationPath(outputDir + 'test.files.js'), config);

    this.defineNpmTask('test', ['npm run test:unit'], 'Alias for `npm run test:unit` task');
    this.defineNpmTask('test:unit', ['karma start ./' + outputDir + 'karma.conf.js'], 'Run unit tests whenever JS code changes, with code coverage');
    this.defineNpmTask('test:unit:once', ['karma start --singleRun=true ./' + outputDir + 'karma.conf.js'], 'Run unit tests once');
    this.defineNpmTask('test:unit:debug', ['karma start ./' + outputDir + 'karma.debug.conf.js'], 'Run unit tests in a browser to make debugging easier (no code coverage)');

    this.addReadmeDoc('extensionPoint.testUnit', this.buildTool.getResources().readme.extensionPoint.testUnit);
  }

  return {
    write: write
  };
};
