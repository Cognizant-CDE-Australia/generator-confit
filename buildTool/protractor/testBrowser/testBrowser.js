'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Protractor browser-test options');
    var buildToolResources = this.buildTool.getResources().testBrowser;

    this.setNpmDevDependenciesFromArray(buildToolResources.packages);

    var config = this.getGlobalConfig();
    var outputDir = config.paths.config.configDir + 'testBrowser/';

    this.fs.copyTpl(
      this.toolTemplatePath('protractor.conf.js.tpl'),
      this.destinationPath(outputDir + 'protractor.conf.js'),
      config
    );

    // First check whether this configuration supports browser testing
    var unsupportedMessage = this.isBuildToolSupported(buildToolResources);
    if (unsupportedMessage) {
      this.defineNpmTask('test:browser', ['echo ' + unsupportedMessage], unsupportedMessage);
    } else {
      this.defineNpmTask('test:browser', ['protractor ' + outputDir + 'protractor.conf.js'], 'Run browser tests against the *development* web server (the development server **must** be running)');
      this.addReadmeDoc('extensionPoint.testBrowser', buildToolResources.readme.extensionPoint);
    }
  }

  return {
    write: write
  };
};
