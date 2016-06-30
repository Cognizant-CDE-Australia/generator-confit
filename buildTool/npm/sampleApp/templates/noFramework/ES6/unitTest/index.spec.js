'use strict';
const componentUnderTest = require('../<%= paths.input.srcDir + paths.input.libDir %>demo/index');
const assert = require('assert');   // Node's assert library

describe('Sample App', () => {
  it('should have a hello() function which says "hello"', () => {
    assert.equal(componentUnderTest.hello('Brett'), 'hello Brett');
  });
});
