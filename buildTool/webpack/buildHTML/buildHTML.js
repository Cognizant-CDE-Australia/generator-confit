'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack buildHTML options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'html-loader': '*'

    });
  }


  return {
    write: write
  };
};
