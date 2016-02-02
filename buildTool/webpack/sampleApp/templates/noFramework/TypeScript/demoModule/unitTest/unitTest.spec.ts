'use strict';

import app from '../app';
import demoModule from '../demoModule';

describe('Basic unit test', function () {

  var adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together', function () {
    expect(adder(2, 3)).toEqual(5);
  });
});


describe('Test imported module', function () {
  it('should have a demoModule with a gotoPage method', function () {
    expect(typeof demoModule.gotoPage).toEqual('function');
  });
});
