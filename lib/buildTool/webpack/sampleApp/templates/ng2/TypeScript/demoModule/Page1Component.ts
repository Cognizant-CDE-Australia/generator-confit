import {Component} from 'angular2/core';
import {OnActivate} from 'angular2/router';
import {DemoService} from './DemoService';

@Component({
  selector: 'page1',
  providers: [DemoService],
  directives: [],
  pipes: [],
  styles: [],
  template: require('./template/page1.html')
})
export class Page1Component implements OnActivate {
  demoService: DemoService;

  constructor(demoService: DemoService) {
    this.demoService = demoService;
  }

  routerOnActivate() {
    this.demoService.demo('Now on Page1');
  }
}

