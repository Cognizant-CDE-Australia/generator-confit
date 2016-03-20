'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Protractor browser-test options');
    var toolResources = this.buildTool.getResources().testBrowser;
    // First check whether this configuration supports browser testing
    var unsupportedMessage = this.isBuildToolSupported(toolResources);

    this.addNpmTasks(toolResources.tasks, unsupportedMessage);
    this.setNpmDevDependenciesFromArray(toolResources.packages);

    var config = this.getGlobalConfig();
    var outputDir = config.paths.config.configDir + 'testBrowser/';

    this.fs.copyTpl(
      this.toolTemplatePath('protractor.conf.js.tpl'),
      this.destinationPath(outputDir + 'protractor.conf.js'),
      config
    );

    if (!unsupportedMessage) {
      this.addReadmeDoc('extensionPoint.testBrowser', toolResources.readme.extensionPoint);
    }
  }

  return {
    write: write
  };
};
