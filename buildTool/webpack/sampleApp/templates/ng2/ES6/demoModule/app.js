/*
 * Providers provided by Angular
 */
import {bootstrap} from 'angular2/platform/browser';
/*
 * Platform and Environment
 * our providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';

// platform/browser/provider imports:
import {provide} from 'angular2/core';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';

// App-component specific imports:
import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Page1Component} from './Page1Component';
import {Page2Component} from './Page2Component';

// Require the CSS file explicitly (or it could be defined as an entry-point too).
<%
var cssEntryPointFiles = resources.sampleApp.cssSourceFormat[buildCSS.sourceFormat].entryPointFileNames.map(function(file) {
  return paths.input.stylesDir + file;
});

cssEntryPointFiles.forEach(function(file) { -%>
require('./<%= file %>');
<% }); -%>

/*
 * App Component
 * Top Level Component
 */
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
