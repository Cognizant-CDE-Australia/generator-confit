'use strict';

/**
 * TypeScriptUtils - helper methods for dealing with *the crap* that comes with using TypeScript.
 *
 * Primarily, we need to add support for loading type libraries through "typingsJS". To do that,
 * we create
 */

const _ = require('lodash');
const resources = require('./resources.js');
const resource = resources.getResources().TypeScriptUtils;
let typingConfig = {};

// Add the type libs from the resource file
addTypeLibsFromArray(resource.typeLibs);


function addTypeLibsFromArray(arr) {
  arr.forEach(typeDef => addTypeLib(typeDef));
}

function addTypeLib(typeDef) {
  typingConfig[typeDef.key] = typingConfig[typeDef.key] || {};  // Make sure the parent key exists first
  typingConfig[typeDef.key][typeDef.name] = typeDef.version;
}

function getTypeLibConfig() {
  return _.merge({}, typingConfig);
}

module.exports = {
  addTypeLibsFromArray: addTypeLibsFromArray,
  getTypeLibConfig: getTypeLibConfig
};
