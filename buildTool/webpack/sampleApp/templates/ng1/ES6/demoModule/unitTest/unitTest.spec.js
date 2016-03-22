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
  var demoService;

  beforeEach(function() {
    angular.mock.module(demoModule);

    angular.mock.inject(function(_demoService_) {
      demoService = _demoService_;
    });
  });

  it('should have a demoService with a demo method', function () {
    expect(typeof demoService.demo).toEqual('function');
  });
});
