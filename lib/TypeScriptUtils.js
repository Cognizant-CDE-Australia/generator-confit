'use strict';

/**
 * TypeScriptUtils - helper methods for dealing with *the crap* that comes with using TypeScript.
 *
 * Primarily, we need to add support for loading type libraries through "TypingsJS".
 */

const _ = require('lodash');
let typingConfig = {};

module.exports = {
  addTypeLibsFromArray,
  getTypeLibConfig
};


function addTypeLibsFromArray(arr) {
  (arr || []).forEach(typeDef => addTypeLib(typeDef));
}

function addTypeLib(typeDef) {
  typingConfig[typeDef.key] = typingConfig[typeDef.key] || {};  // Make sure the parent key exists first
  typingConfig[typeDef.key][typeDef.name] = typeDef.version;
}

function getTypeLibConfig() {
  return _.merge({}, typingConfig);
}
