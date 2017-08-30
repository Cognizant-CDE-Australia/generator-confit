// START_CONFIT_GENERATED_CONTENT
<%
var extendArr = [];
var plugins = [];
var globals = [];
var env = [];
var hasJSX = false;


if (verify.jsCodingStandard === 'AirBnB') {
  extendArr.push('airbnb');
}
if (verify.jsCodingStandard === 'ESLint') {
  extendArr.push('eslint:recommended');
}
if (verify.jsCodingStandard === 'Google') {
  extendArr.push('google');
}
if (verify.jsCodingStandard === 'StandardJS') {
  extendArr.push('standard');
}


if (app.projectType === 'node') {
  plugins.push('node');
  extendArr.push('plugin:node/recommended');
  env.push('node');
  env.push('mocha');
}

if (app.projectType === 'browser') {
  env.push('browser');
  env.push('jasmine');
  env.push('protractor');
}

if (buildJS.sourceFormat === 'ES6') {
  env.push('es6');
}


if (buildJS.framework[0] === 'AngularJS 1.x') {
  globals.push('angular');
}

if (buildJS.framework[0] === 'React (latest)') {
  hasJSX = true;
}

-%>
let config = {
  extends: [<%- extendArr.map(function(item) { return '\'' + item + '\''; }).join(', ') -%>],
  plugins: [<%- plugins.map(function(item) { return '\'' + item + '\''; }).join(', ') -%>],
  env: {
    commonjs: true,    // For Webpack, CommonJS
    <%- env.map(function(item) { return '\'' + item + '\': true' }).join(',\n    ') %>
  },
  globals: {
    <%- globals.map(function(item) { return '\'' + item + '\': true' }).join(',\n    ') %>
  },
  parser: '<%- (app.projectType === 'browser') ? 'babel-eslint' : 'espree' %>',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: <%- hasJSX %>,
    }
  },
  rules: {
    'max-len': ['warn', 200]  // Line length
  }
};
// END_CONFIT_GENERATED_CONTENT
// Customise 'config' further in this section to meet your needs...



// START_CONFIT_GENERATED_CONTENT
module.exports = config;
// END_CONFIT_GENERATED_CONTENT
