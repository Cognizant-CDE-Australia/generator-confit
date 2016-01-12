'use strict';

var path = require('path');
var assert = require('assert');
var server = require('./../server');

var fixtureDir = process.env.FIXTURE_DIR;
var fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
var tempTestDir = process.env.TEST_DIR;


//module.exports = function() {

  describe('npm run dev TEST', function() {

    var baseUrl;

    before(function() {
      // Start up the confit DEV webserver
      return server.start(tempTestDir, 'serverDev', 10000).then(function success(result) {
        baseUrl = result.baseUrl;
      });
    });

    it('should pass, mate', function() {
      assert.equal(1 + 1, 2);
    });

    it('should fail, man', function() {
      assert.equal(2 + 2, 4);
    });

    after(function() {
      server.stop();
    });
  });
//};
