'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildAssets options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'file-loader': '*'
    });

    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    gen.fs.copy(
      gen.toolTemplatePath('webpack.buildAssets.config.js'),
      gen.destinationPath(outputDir + 'webpack/webpack.buildAssets.config.js')
    );
  }

  return {
    write: write
  };
};
