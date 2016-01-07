'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing Webpack "serverDev" options');
    gen.defineNpmTask('serve:dev', ['echo']); // do nothing
  }

  return {
    write: write
  };
};
