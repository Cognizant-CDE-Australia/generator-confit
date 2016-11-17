import { Injectable } from '@angular/core';

@Injectable()
export class DemoService {
  demo(param) {
    window.console.log('Message from demoService.demo():' + param);
  };
}


