import { inject, async, TestBed } from '@angular/core/testing';
import { DemoService } from '../demo.service';

describe('Basic unit test', () => {

  let adder = function (x, y) {
    return x + y;
  };

  it('should add two numbers together', () => {
    expect(adder(2, 3)).toEqual(5);
  });
});


describe('Test imported module', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoService]
    });
  });

  it('should have a demoService with a demo method',
    async(inject([DemoService], (demoService: DemoService) => {
      expect(typeof demoService.demo).toEqual('function');
    }))
  );
});


describe('Test a simple imported module without Angular testing cruft', () => {
  it('should have a demoService with a demo method', () => {
    let demoService = new DemoService();
    expect(typeof demoService.demo).toEqual('function');
  });
});
