'use strict';
// This file is run inside a Webpack context, which allows it to use require.context() to get a list of files to include at run time

// START_CONFIT_GENERATED_CONTENT
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
var testing = require('@angular/testing');
var browser = require('@angular/platform-browser/testing/browser');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_APPLICATION_PROVIDERS
);

Object.assign(global, testing);
<% } %>

// Don't load any source code! The unit tests are responsible for loading the code-under-test.
// Includes the *.spec.<ext> files in the unitTest directory. The '<%= relativePath %>' is the relative path from where
// this file is (<%= configPath %>) to where the source folders are.
var testsContext = require.context('<%- relativePath + paths.input.modulesDir.substr(0, paths.input.modulesDir.length - 1) %>', true, __karmaTestSpec);
testsContext.keys().forEach(testsContext);
// END_CONFIT_GENERATED_CONTENT
