'use strict';

var path = require('path');
var assert = require('assert');

var fixtureDir = process.env.FIXTURE_DIR;
var fixtureFileName = process.env.FIXTURE;   // Passed from the testRunner
var tempTestDir = process.env.TEST_DIR;

describe('x', function() {
  it('simple test', function() {

    // The actual tests
    assert.equal(1 + 1, 4);

  });

  // The mocha --delay flag provides a root-level run() callback, signifying that we have finished the initial asynchronous processing
  //run();
});

