import {Component} from 'angular2/core';
import {OnActivate} from 'angular2/router';
import {DemoService} from './DemoService';

@Component({
  selector: 'page2',
  providers: [DemoService],
  directives: [],
  pipes: [],
  styles: [],
  template: require('./template/page2.html')
})
export class Page2Component implements OnActivate {
  demoService: DemoService;

  constructor(demoService: DemoService) {
    this.demoService = demoService;
  }

  routerOnActivate() {
    this.demoService.demo('Now on Page2');
  }
}

