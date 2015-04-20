module.exports = function() {
  'use strict';

  function write(generator) {
    generator.log('Writing grunt path options');
  };


  return {
    write: write
  };
};
