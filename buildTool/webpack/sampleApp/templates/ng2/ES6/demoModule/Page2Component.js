import {Component} from 'angular2/core';
import {OnActivate} from 'angular2/router';
import {DemoService} from './DemoService';

let componentAnnotation = new Component({
  selector: 'page2',
  providers: [DemoService],
  directives: [],
  pipes: [],
  styles: [],
  template: require('./template/page2.html')
});

export class Page2Component {

  constructor(demoService) {
    this.demoService = demoService;
  }

  routerOnActivate() {
    this.demoService.demo('Now on Page2');
  }

  static get parameters(){
    return [[DemoService]];
  }
}

Page2Component.annotations = [componentAnnotation];

