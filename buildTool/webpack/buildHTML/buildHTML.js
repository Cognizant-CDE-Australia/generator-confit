'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildHTML options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'html-loader': '*',
      'html-webpack-plugin': '*'
    });

    // TODO: Add optional support for other HTML formats? E.g. Jade? (or not - it's kinda lame)

    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    gen.fs.copy(
      gen.toolTemplatePath('webpack.buildHTML.config.js'),
      gen.destinationPath(outputDir + 'webpack/webpack.buildHTML.config.js')
    );
  }


  return {
    write: write
  };
};
