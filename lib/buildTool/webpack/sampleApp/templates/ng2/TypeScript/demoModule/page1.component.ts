import {Component} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {DemoService} from './demo.service';   // Injected at the root level

@Component({
  selector: 'page1',
  styles: [],
  template: require('./template/page1.html')
})
export class Page1Component {
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
