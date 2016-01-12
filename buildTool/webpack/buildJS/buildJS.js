'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildJS options');

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      // TODO: Make this optional: For converting ES6 to ES5:
      'babel-core': '6.4.0',
      'babel-runtime': '6.3.19',
      'babel-loader': '6.2.1',
      'babel-preset-es2015': '6.3.13'
    });
  }

  return {
    write: write
  };
};
