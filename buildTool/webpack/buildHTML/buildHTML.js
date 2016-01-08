'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildHTML options');

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'html-loader': '*',
      'html-webpack-plugin': '*'
    });
  }

  return {
    write: write
  };
};
