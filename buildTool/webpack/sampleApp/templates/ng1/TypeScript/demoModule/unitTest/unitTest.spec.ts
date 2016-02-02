'use strict';

// This is correct - the unit test should import the code-under-test. Can only do this when using a module-loader like Webpack, Node, JSPM
import app from '../app';

describe('Basic unit test', function () {

  var adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together', function () {
    expect(adder(2, 3)).toEqual(5);
  });
});
