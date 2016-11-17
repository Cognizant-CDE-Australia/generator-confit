import { Component, ViewEncapsulation } from '@angular/core';

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
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent { }
