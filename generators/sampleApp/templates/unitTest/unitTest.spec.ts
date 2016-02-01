'use strict';

// This is a little weird (compared to ng1), the unit test imports the app
import app from '../app';

describe('Basic unit test', function () {

  var adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together', function () {
    expect(adder(2, 3)).toEqual(5);
  });
});
