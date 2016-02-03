'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack serverDev options');
    this.defineNpmTask('serve:dev', ['echo']); // do nothing, nothing to do!
  }

  return {
    write: write
  };
};
