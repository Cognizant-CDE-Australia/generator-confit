import {Component} from 'angular2/core';
import {OnActivate} from 'angular2/router';
import {DemoService} from './DemoService';

let componentAnnotation = new Component({
  selector: 'page1',
  providers: [DemoService],
  directives: [],
  pipes: [],
  styles: [],
  template: require('./template/page1.html')
});

export class Page1Component {

  constructor(demoService) {
    this.demoService = demoService;
  }

  routerOnActivate() {
    this.demoService.demo('Now on Page1');
  }

  static get parameters() {
    return [[DemoService]];
  }
}

Page1Component.annotations = [componentAnnotation];
