'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack buildAssets options');

    // Add the NPM dev dependencies
    this.setNpmDevDependencies({
      'file-loader': '*'
    });
  }

  return {
    write: write
  };
};
