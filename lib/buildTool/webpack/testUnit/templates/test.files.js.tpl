// This file is run inside a Webpack context, which allows it to use require.context() to get a list of files to include at run time
/*
 * When testing with webpack and ES6, we have to do some extra
 * things to get testing to work right. Because we are gonna write tests
 * in ES6 too, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it will compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */


// START_CONFIT_GENERATED_CONTENT
Error.stackTraceLimit = Infinity;

// Polyfill required for PhantomJS
require('phantomjs-polyfill');

// Load the test dependencies!
<%

// Determine the relative path from this folder to the root directory
var configPath = paths.config.configDir + resources.testUnit.configSubDir;
var relativePath = configPath.replace(/([^/]+)/g, '..');

// Need to support actual modules as well as relative path files (./path/to/file.js), which are relative to the srcDir
testUnit.testDependencies.forEach(function(moduleName) {
  if (moduleName.indexOf('./') === 0) {
%>require('<%- relativePath + paths.input.srcDir + moduleName.substr(2) %>');
<% } else {
%>require('<%= moduleName -%>');
<% }
});

var sourceFormat = buildJS.sourceFormat;
var selectedFramework = buildJS.framework[0] || '';

// Framework + Source-Format specific rules...
if (sourceFormat === 'TypeScript' && selectedFramework === 'AngularJS 2.x') {
%>

// Load Angular 2's Jasmine helper methods:
var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);
<% } %>

// Don't load any source code! The unit tests are responsible for loading the code-under-test.
// Includes the *.spec.<ext> files in the unitTest directory. The '<%= relativePath %>' is the relative path from where
// this file is (<%= configPath %>) to where the source folders are.
var testsContext = require.context('<%- relativePath + paths.input.modulesDir.substr(0, paths.input.modulesDir.length - 1) %>', true, __karmaTestSpec);
testsContext.keys().forEach(testsContext);
// END_CONFIT_GENERATED_CONTENT
