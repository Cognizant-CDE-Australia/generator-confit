// Helper methods for Webpack configuration files
'use strict';

const path = require('path');

// Helper functions
let ROOT = '';

const helpers = (rootPath) => {
  ROOT = rootPath;

  return {
    pathRegEx,
    removeHash,
    findLoader,
    hasLoader,
    hasProcessFlag,
    isWebpackDevServer,
    root
  }
};

module.exports = helpers;

// Convert a Linux/OSX path expression inside a RegEx into a platform-specific expressions
function pathRegEx(regEx) {
  const sep = escapeStrRegEx(path.sep);

  if (typeof regEx === 'string') {
    return regEx.replace(/\//g, sep);
  }
  return new RegExp(regEx.source.replace(/\\\//g, sep));
}


function escapeStrRegEx(text) {
  return text.replace(/[-[\]/{}()*+?.,\\^$|#\s]/g, '\\$&');
}


function removeHash(parentObj, prop, regExMatcher) {
  let value = parentObj[prop];
  let matcher = regExMatcher || /\[(contentHash|hash).*?\]/;

  parentObj[prop] = value.replace(matcher, '');
}


function findLoader(config, loaderName) {
  return config.module.rules.find(rule => hasLoader(rule, loaderName));
}

// For a rule, determine if it has a loader that matches loaderName
function hasLoader(rule, loaderName) {
  if (!rule.use) {
    return false;
  }

  let matchingLoaders = rule.use.find(function(loader) {
    return loader.loader === loaderName;
  });
  return !!matchingLoaders;
}


function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}
