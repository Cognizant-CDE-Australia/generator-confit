import {DemoService} from '../DemoService';

describe('Basic unit test', () => {

  var adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together',() => {
    expect(adder(2, 3)).toEqual(5);
  });
});


describe('Test imported module', () => {
  var demoService;

  beforeEach(() => {
    demoService = new DemoService();
  });

  it('should have a demoService with a demo method', () => {
    expect(typeof demoService.demo).toEqual('function');
  });
});
