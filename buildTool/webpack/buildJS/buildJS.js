'use strict';

var webpackConfigurator = require('../webpackConfigurator');

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildJS options');

    var buildJSRequire = {
      'bower-webpack-plugin': 'BowerWebpackPlugin'
    };

    webpackConfigurator.require(buildJSRequire);

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'babel-core': '*',
      'babel-runtime': '*',
      'babel-loader': '*'
    });
  }


  return {
    write: write
  };
};
