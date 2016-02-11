'use strict';

const _ = require('lodash');

module.exports = function() {

  function write() {
    this.log('Writing Webpack finish options');

    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().zzfinish.packages);

    // Merge all-the-things into a data object for use by our templates
    var config = _.merge({}, this.getGlobalConfig(), {
      buildTool: this.buildTool.getResources(),
      resources: this.getResources()
    });
    var outputDir = config.paths.config.configDir;

    this.addReadmeDoc('extensionPoint.start', this.buildTool.getResources().readme.extensionPoint.start);

    this.updateJSFile.call(this, this.toolTemplatePath('webpack.config.js.tpl'), this.destinationPath(outputDir + 'webpack/webpack.config.js'), config);
    this.updateJSFile.call(this, this.toolTemplatePath('dev.webpack.config.js'), this.destinationPath(outputDir + 'webpack/dev.webpack.config.js'), config);
    this.updateJSFile.call(this, this.toolTemplatePath('prod.webpack.config.js'), this.destinationPath(outputDir + 'webpack/prod.webpack.config.js'), config);

    // Setup things to run on end, if we have anything
    var cmd = this.buildTool.getResources().zzfinish.onEnd;
    if (cmd) {
      this.runOnEnd(cmd.cmd, cmd.args);
    }
  }

  return {
    write: write
  };
};
