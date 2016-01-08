'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack finish options');

    var config = this.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'webpack': '*',
      'webpack-dev-server': '*',
      'extract-text-webpack-plugin': '0.9.1' // latest version (1.0.0) is missing a dependency. Revert to earlier version
    });

    this.fs.copyTpl(this.toolTemplatePath('webpack.config.js.tpl'), this.destinationPath(outputDir + 'webpack/webpack.config.js'), config);
    this.fs.copy(this.toolTemplatePath('dev.webpack.config.js'), this.destinationPath(outputDir + 'webpack/dev.webpack.config.js'));
    this.fs.copy(this.toolTemplatePath('prod.webpack.config.js'), this.destinationPath(outputDir + 'webpack/prod.webpack.config.js'));
  }

  return {
    write: write
  };
};
