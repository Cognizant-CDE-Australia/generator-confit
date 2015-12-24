'use strict';

var _ = require('lodash');

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildJS options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'bower-webpack-plugin': '*',
      'lodash': '*',

      // For converting ES6 to ES5:
      'babel-core': '*',
      'babel-runtime': '*',
      'babel-loader': '*',
      'babel-preset-es2015': '6.1.18'
    });


    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    gen.fs.copy(
      gen.toolTemplatePath('webpack.buildJS.config.js'),
      gen.destinationPath(outputDir + 'webpack/webpack.buildJS.config.js')
    );
  }


  return {
    write: write
  };
};
