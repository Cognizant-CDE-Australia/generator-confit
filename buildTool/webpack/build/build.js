'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing "entryPoint" options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'lodash': '*'
    });

    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    gen.fs.copy(
      gen.toolTemplatePath('webpack.build.config.js'),
      gen.destinationPath(outputDir + 'webpack/webpack.build.config.js')
    );
  }

  return {
    write: write
  };
};
