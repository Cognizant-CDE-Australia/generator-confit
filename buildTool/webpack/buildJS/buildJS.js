'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildJS options');

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
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
