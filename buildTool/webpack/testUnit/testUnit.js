'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack unit-test options');

    var config = this.getGlobalConfig();
    var outputDir = config.paths.config.configDir + 'testUnit/';

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      karma: '0.13.19',
      'karma-chrome-launcher': '0.2.2',
      'karma-coverage': '0.5.3',
      'karma-jasmine': '0.3.6',
      'karma-junit-reporter': '0.3.8',
      'karma-ng-html2js-preprocessor': '0.2.0',
      'karma-phantomjs-launcher': '0.2.3',
      'karma-sourcemap-loader': '0.3.7',
      'karma-spec-reporter': '0.0.23',
      'karma-threshold-reporter': '0.1.15',
      'karma-webpack': '1.7.0',
      'jasmine-core': '2.4.1',     // Peer dep of karma-jasmine
      phantomjs: '1.9.19',          // Peer dep of karma-phantomjs-launcher
      'phantomjs-polyfill': '0.0.1',
      'isparta-loader': '1.0.0'
    });

    this.fs.copy(this.toolTemplatePath('karma.conf.js'), this.destinationPath(outputDir + 'karma.conf.js'));
    this.fs.copy(this.toolTemplatePath('karma.debug.conf.js'), this.destinationPath(outputDir + 'karma.debug.conf.js'));
    this.fs.copyTpl(this.toolTemplatePath('karma.common.js'), this.destinationPath(outputDir + 'karma.common.js'), config);
    this.fs.copyTpl(this.toolTemplatePath('test.files.js.tpl'), this.destinationPath(outputDir + 'test.files.js'), config);

    this.defineNpmTask('test', ['npm run test:unit'], 'Alias for `npm run test:unit` task');
    this.defineNpmTask('test:unit', ['karma start ./' + outputDir + 'karma.conf.js'], 'Run unit tests whenever JS code changes, with code coverage');
    this.defineNpmTask('test:unit:once', ['karma start --singleRun=true ./' + outputDir + 'karma.conf.js'], 'Run unit tests once');
    this.defineNpmTask('test:unit:debug', ['karma start ./' + outputDir + 'karma.debug.conf.js'], 'Run unit tests in a browser to make debugging easier (no code coverage)');

    this.addReadmeDoc('extensionPoint.testUnit', '`npm test:unit` can be extended by modifying **' + outputDir +
      'karma.conf.js** and **' + outputDir + 'karma.common.js**. **' + outputDir +
      'test.files.js** is generated from the entry points in the Confit configuration. It is best to modify the entry points in **confit.json**, then re-run `yo confit`.');
  }

  return {
    write: write
  };
};
