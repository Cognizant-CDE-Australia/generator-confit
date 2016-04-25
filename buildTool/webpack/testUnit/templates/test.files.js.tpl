'use strict';
// This file is run inside a Webpack context, which allows it to use require.context() to get a list of files to include at run time

// START_CONFIT_GENERATED_CONTENT
// Polyfill required for PhantomJS
require('phantomjs-polyfill');

// Load the test dependencies!<%
testUnit.testDependencies.forEach(function(moduleName) { %>
require('<%= moduleName -%>');
<%
});

// Add any Framework + SourceFormat -specific test unit config
var jsFrameworkConfig = buildTool.sampleApp.js.framework;
var sourceFormat = buildJS.sourceFormat;
var selectedFramework = buildJS.framework[0] || '';
var selectedFrameworkConfig = jsFrameworkConfig[selectedFramework] || { sourceFormat: {} };
var selectedFrameworkSourceFormatConfig = selectedFrameworkConfig.sourceFormat[sourceFormat]
var testConfigForFramework = (selectedFrameworkSourceFormatConfig || {}).testUnitConfig;

if (testConfigForFramework) {
%>
<%- testConfigForFramework %>
<%
}

// Determine the relative path from this folder to the root directory
var configPath = paths.config.configDir + 'testUnit/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
%>

// Don't load any source code! The unit tests are responsible for loading the code-under-test.
// Includes the *.spec.<ext> files in the unitTest directory. The '<%= relativePath %>' is the relative path from where
// this file is (<%= configPath %>) to where the source folders are.
var testsContext = require.context('<%- relativePath + paths.input.modulesDir.substr(0, paths.input.modulesDir.length - 1) %>', true, __karmaTestSpec);
testsContext.keys().forEach(testsContext);
// END_CONFIT_GENERATED_CONTENT
