import * as angular from 'angular';
import demoModule from '../demoModule';
import 'angular-mocks';

describe('Basic unit test', function () {

  let adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together', function () {
    expect(adder(2, 3)).toEqual(5);
  });
});


describe('Test imported module', function () {
  let service;

  beforeEach(function() {
    angular.mock.module(demoModule);

    angular.mock.inject(function(demoService) {
      service = demoService;
    });
  });

  it('should have a demoService with a demo method', function () {
    expect(typeof service.demo).toEqual('function');
  });
});
