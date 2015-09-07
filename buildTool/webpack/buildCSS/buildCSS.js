'use strict';

var webpackConfigurator = require('../webpackConfigurator');

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildCSS options');

    var requires = {
      'extract-text-webpack-plugin': 'ExtractTextPlugin'
    };

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'css-loader': '*',
      'style-loader': '*'
    });

    var config = gen.getGlobalConfig();
    var compiler = config.buildCSS.cssCompiler;

    gen.setNpmDevDependencies({'stylus-loader': '*'}, compiler === 'stylus');
    gen.setNpmDevDependencies({'sass-loader': '*'}, compiler === 'sass');
    gen.setNpmDevDependencies({'autoprefixer-loader': '*'}, config.buildCSS.autoprefixer === true);


    webpackConfigurator.require(requires);
  }


  return {
    write: write
  };
};
