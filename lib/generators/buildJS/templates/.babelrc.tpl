{
<%
// ES2015 preset for Babel, and Webpack. Modules:false means "Don't transform ES6 modules".
// Webpack 2 understands ES6 modules, so Babel doesn't need to transform them.
var modulesFlag = (app.projectType === 'browser') ? false : '"commonjs"';

var presets = [];
var plugins = ['add-module-exports'];

if (buildJS.outputFormat === 'ES5') {
  presets.push(["es2015", {"modules": modulesFlag }]);
}

if (buildJS.framework.indexOf('React (latest)') > -1) {
  presets.push("react-app");
}

-%>
  "presets": <%- printJson(presets, 2, true) %>,
  "plugins": <%- printJson(plugins, 2, true) %>
}
