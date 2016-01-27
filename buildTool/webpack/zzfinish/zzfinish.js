'use strict';

var updateJSFile = require('../../../lib/fileUtils').updateJSFile;

module.exports = function() {

  function write() {
    this.log('Writing Webpack finish options');

    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().zzfinish.packages);

    var config = this.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    this.addReadmeDoc('extensionPoint.start', this.buildTool.getResources().readme.extensionPoint.start);

    updateJSFile.call(this, this.toolTemplatePath('webpack.config.js.tpl'), this.destinationPath(outputDir + 'webpack/webpack.config.js'), config);
    updateJSFile.call(this, this.toolTemplatePath('dev.webpack.config.js'), this.destinationPath(outputDir + 'webpack/dev.webpack.config.js'), config);
    updateJSFile.call(this, this.toolTemplatePath('prod.webpack.config.js'), this.destinationPath(outputDir + 'webpack/prod.webpack.config.js'), config);
  }

  return {
    write: write
  };
};
