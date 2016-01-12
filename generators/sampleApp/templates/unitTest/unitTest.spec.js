'use strict';

describe('Basic unit test', function () {

  var adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together', function () {
    expect(adder(2, 3)).toEqual(5);
  });
});
