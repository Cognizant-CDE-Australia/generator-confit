'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Webpack app options');
  }

  return {
    write: write
  };
};
