'use strict';

var _ = require('lodash');

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildJS options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'bower-webpack-plugin': '*',

      // TODO: Make this optional: For converting ES6 to ES5:
      'babel-core': '*',
      'babel-runtime': '*',
      'babel-loader': '*',
      'babel-preset-es2015': '6.1.18'
    });
  }


  return {
    write: write
  };
};
