import {provide, enableProdMode} from 'angular2/core';
import {Component} from 'angular2/core';
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Page1Component} from './Page1Component';
import {Page2Component} from './Page2Component';

// Require the CSS file explicitly (or it could be defined as an entry-point too).
<% $CSSEntryPoints.forEach(function (file) { -%>
require('./<%= file %>');
<% }); -%>

// Environment setup
const ENV_PROVIDERS = [];

if (__PROD__) {
  enableProdMode();
} else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}


let componentAnnotation = new Component({
  selector: 'app',
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  providers: [],
  directives: [ ...ROUTER_DIRECTIVES ],
  pipes: [],
  styles: []
});

let routeConfig = new RouteConfig([
  { path: '/', component: Page1Component, name: 'Index' },
  { path: '/page1', component: Page1Component, name: 'Page1' },
  { path: '/page2', component: Page2Component, name: 'Page2' },
  // TODO: Not yet using es6-promise-loader (for Webpack) to load components dynamically.
  { path: '/**', redirectTo: ['Index'] }
]);

export class App {
}

App.annotations = [componentAnnotation, routeConfig];


/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
function main() {
  bootstrap(App, [
    ...ENV_PROVIDERS,
    ...ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
  ])
    .catch(err => console.error(err));
}


document.addEventListener('DOMContentLoaded', main);
