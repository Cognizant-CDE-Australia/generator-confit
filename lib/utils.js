'use strict';

var ejs = require('ejs');
var ejsHelperScript = `<%
  // Simple object merge
  function merge(obj1, obj2) {
    var newObj = {};
    for (var key in obj1) { newObj[key] = obj1[key]; }
    for (var key in obj2) { newObj[key] = obj2[key]; }
    return newObj;
  }

  // Like _.values(), returns the list of object values. Non recursive.
  function objectValues(obj) {
    return Object.keys(obj || {}).sort().map(function (key) { return obj[key]; });
  }

  // simple link maker for Markdown - uses the url as the link text
  function link(url) {
    return '[' + url + '](' + url + ')';
  }
  %>`;


/**
 * Decorator for ejs.render() - adds additional functions: merge(), objectValues() and link()
 * @param text
 * @param template
 * @returns {String}
 */
function renderEJS(text, template) {
  return ejs.render(ejsHelperScript + text, template);
}


module.exports = {
  renderEJS: renderEJS
};