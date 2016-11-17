{
<%
// ES2015 preset for Babel, and Webpack. Modules:false means "Don't transform ES6 modules".
// Webpack 2 understands ES6 modules, so Babel doesn't need to transform them.
var modulesFlag = (app.projectType === 'browser') ? false : '"commonjs"';

var presets = [];
var plugins = [];

if (buildJS.outputFormat === 'ES5') {
  presets.push(['es2015', {'modules': modulesFlag }]);
}

if (buildJS.framework.indexOf('React (latest)') > -1) {
  presets.push('react-app');
  plugins.push('react-hot-loader/babel');
}

-%>
<% if (buildJS.sourceFormat === 'ES6') {
// Modify the Babel loader to add the Istanbul Babel plugin for code coverage

var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var testFilesGlob = '**/' + paths.input.unitTestDir + '*.spec.(' + jsExtensions.join('|') + ')';
%>
  "env": {
    "test": {
      "plugins": [
        ["istanbul", {
          "exclude": [
            "<%- testFilesGlob %>"
          ]
        }]
      ]
    }
  },<% } %>
  "presets": <%- printJson(presets, 2, true) %>,
  "plugins": <%- printJson(plugins, 2, true) %>
}
