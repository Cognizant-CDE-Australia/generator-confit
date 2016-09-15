'use strict';

/*
 * TypeScriptUtils - helper methods for dealing with *the crap* that comes with using TypeScript.
 *
 * Primarily, we need to add support for loading type libraries through "TypingsJS".
 */
let typingConfig = {};

module.exports = {
  addTypeLibsFromArray,
  getTypeLibConfig
};


/**
 * Parses an array of TypeLib definitions to addTypeLib()
 * @param {Array.<TypeLibDefn>} arr   An array of TypeLib definition objects
 */
function addTypeLibsFromArray(arr) {
  (arr || []).forEach(addTypeLib);
}

/**
 * Adds the TypeLib info to the typingConfig object
 * @param {Object} typeDef    TypeLib defintion consists of a {key, name, version}
 */
function addTypeLib(typeDef) {
  typingConfig[typeDef.key] = typingConfig[typeDef.key] || {};  // Make sure the parent key exists first
  typingConfig[typeDef.key][typeDef.name] = typeDef.version;
}

/**
 * Get a copy of the typingConfig
 * @return {Object}    Returns a copy of the typingConfig
 */
function getTypeLibConfig() {
  return Object.assign({}, typingConfig);
}
