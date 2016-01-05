'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildCSS options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'css-loader': '*',
      'style-loader': '*'
    });

    var config = gen.getGlobalConfig();
    var compiler = config.buildCSS.cssCompiler;

    gen.setNpmDevDependencies({'stylus-loader': '*'}, compiler === 'stylus');
    gen.setNpmDevDependencies({'sass-loader': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'node-sass': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'autoprefixer-loader': '*'}, config.buildCSS.autoprefixer === true);
  }

  return {
    write: write
  };
};
