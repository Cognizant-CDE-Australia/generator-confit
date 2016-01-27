'use strict';

// START_CONFIT_GENERATED_CONTENT
import 'phantomjs-polyfill';

<%
// The entry-point references are either node_modules (or module names),
// OR they are references to local files.

// We only want to test the LOCAL FILES, but we still must IMPORT the non-local files
var eps = [];
for (var key in entryPoint.entryPoints) {
  eps = eps.concat(entryPoint.entryPoints[key]);
}
var moduleEPs = eps.filter(function(file) { return file.indexOf('./') !== 0; });
var sourceEPs = eps.filter(function(file) { return file.indexOf('./') === 0; });
var vendorScripts = buildJS.vendorScripts || [];

// Not entirely comfortable with this, but combine modules defined in the entryPoint with the vendorScripts
// (ASSUMPTION: the vendorScripts are not already in the entryPoint!!!)
vendorScripts = vendorScripts.concat(moduleEPs);
%>

// Load the vendor(node) modules first<%
vendorScripts.forEach(function(moduleName) { %>
import '<%= moduleName -%>';
<% }); -%>

%>// Load the application entry-point(s)<%

// Remove the './' at the start of each file
sourceEPs = sourceEPs.map(function(file) {
  return file.substr(2);
})

sourceEPs.forEach(function(file) { %>
import '../../<%= paths.input.srcDir + file -%>';
<% }); -%>


// Lazily-loaded modules (user-edit)

// Includes all *.spec.js files in the unitTest directory. The '../../' is the relative path from where Karma is (config/testUnit) to where the source folders are.
var testsContext = require.context('../../<%- paths.input.modulesDir.substr(0, paths.input.modulesDir.length - 1) -%>', true, /<%- paths.input.unitTestDir.replace(/\//g, '\\/') %>.*spec\.js$/);
testsContext.keys().forEach(testsContext);
// END_CONFIT_GENERATED_CONTENT
