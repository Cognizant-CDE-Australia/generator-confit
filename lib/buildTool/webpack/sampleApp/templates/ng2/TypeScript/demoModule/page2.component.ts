import {Component} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {DemoService} from './demo.service';

@Component({
  selector: 'page2',
  styles: [],
  template: require('./template/page2.html')
})
export class Page2Component {
  private demoService: DemoService;
  private route: ActivatedRoute;

  constructor(route: ActivatedRoute, demoService: DemoService) {
    this.route = route;
    this.demoService = demoService;
  }

  ngOnInit() {
    this.route.url.forEach((url: UrlSegment[]) => {
      this.demoService.demo(`Now on ${url}`);
    });
  }
}
