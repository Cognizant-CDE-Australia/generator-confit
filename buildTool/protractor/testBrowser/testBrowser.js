'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Protractor browser-test options');
    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().testBrowser.packages);

    var config = this.getGlobalConfig();
    var outputDir = config.paths.config.configDir + 'testBrowser/';

    this.fs.copyTpl(this.toolTemplatePath('protractor.conf.js.tpl'), this.destinationPath(outputDir + 'protractor.conf.js'), config);

    this.defineNpmTask('test:browser', ['protractor ' + outputDir + 'protractor.conf.js'], 'Run browser tests against the DEVELOPMENT web server (the server **must** be running)');

    this.addReadmeDoc('extensionPoint.testBrowser', this.buildTool.getResources().testBrowser.readme.extensionPoint);
  }

  return {
    write: write
  };
};
