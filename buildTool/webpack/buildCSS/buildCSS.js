'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildCSS options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'extract-text-webpack-plugin': '*',
      'css-loader': '*',
      'style-loader': '*'
    });

    var config = gen.getGlobalConfig();
    var compiler = config.buildCSS.cssCompiler;
    var outputDir = config.paths.config.configDir;

    gen.setNpmDevDependencies({'stylus-loader': '*'}, compiler === 'stylus');
    gen.setNpmDevDependencies({'sass-loader': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'node-sass': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'autoprefixer-loader': '*'}, config.buildCSS.autoprefixer === true);

    gen.fs.copy(
      gen.toolTemplatePath('webpack.buildCSS.config.js'),
      gen.destinationPath(outputDir + 'webpack/webpack.buildCSS.config.js')
    );
  }

  return {
    write: write
  };
};
