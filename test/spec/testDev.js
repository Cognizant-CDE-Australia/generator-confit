'use strict';

var assert = require('assert');
var server = require('./../server');
var tempTestDir = process.env.TEST_DIR;

module.exports = function() {

  describe('npm run dev', function() {

    before(function() {
      // Start up the confit webserver
      return server.start(tempTestDir, 10000).then(function success(port) {
        console.log('My port is ', port);

        // Now start protractor with the baseUrl that matches the port
      });
    });

    after(function() {
      server.stop();
    });

    it('be basic is true', function() {
      assert.equal(10, 5 + 5);
    });
  });
};
