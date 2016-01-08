'use strict';

var assert = require('assert');

module.exports = function(testName) {

  describe(testName + 'npm run dev', function() {

    it('be true', function() {
      assert.equal(10, 5 + 5);
    });
  });
};
