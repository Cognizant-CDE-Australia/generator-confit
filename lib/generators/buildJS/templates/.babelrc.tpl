{
<%
// ES2015 preset for Babel, and Webpack. Modules:false means "Don't transform ES6 modules".
// Webpack 2 understands ES6 modules, so Babel doesn't need to transform them.
var modulesFlag = (app.projectType === 'browser') ? false : '"commonjs"';

// Need a different preset for React

-%>
  "presets": [
    <% if (buildJS.outputFormat === 'ES5') { %>
    ["es2015", {"modules": <%- modulesFlag %>}]
    <% } %>
  ]
}
