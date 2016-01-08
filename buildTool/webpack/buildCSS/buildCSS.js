'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildCSS options');

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'css-loader': '*',
      'style-loader': '*'
    });

    var config = this.getGlobalConfig();
    var compiler = config.buildCSS.cssCompiler;

    this.setNpmDevDependencies({'stylus-loader': '*'}, compiler === 'stylus');
    this.setNpmDevDependencies({'sass-loader': '*'}, compiler === 'sass');
    this.setNpmDevDependencies({'node-sass': '*'}, compiler === 'sass');
    this.setNpmDevDependencies({'autoprefixer-loader': '*'}, config.buildCSS.autoprefixer === true);
  }

  return {
    write: write
  };
};
