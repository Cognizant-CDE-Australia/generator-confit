'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildAssets options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'file-loader': '*'
    });
  }

  return {
    write: write
  };
};
