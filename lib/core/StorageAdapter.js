'use strict';

const Storage = require('yeoman-generator/lib/util/storage');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');

module.exports = {
  _getStorage
};


/**
 * Override the _getStorage() method to store our config in 'confit.yml'
 * Can also be passed via the `configFile=path/to/file` flag on CLI
 *
 * @returns {Object}    Storage object
 */
function _getStorage() {
  let possibleFiles = ['confit.yml', 'confit.yaml', 'confit.json'];
  let actualFiles = possibleFiles.filter(file => this.fs.exists(file));

  this.configFile = this.options.configFile || actualFiles.length ? actualFiles[0] : possibleFiles[0];

  let storePath = path.join(this.destinationRoot(), this.configFile);

  // Change the Storage object prototype's _store and _persist methods to support YAML
  _.extend(Storage.prototype, {_store, _persist});

  return new Storage(this.rootGeneratorName(), this.fs, storePath);
}

/**
 * Return the current store as JSON object
 * If the path ends in '.json', treats the file as a JSON file.
 * Otherwise it assumes the file is a YAML file
 *
 * @private
 * @return {Object} the raw store content (including the root-generator node)
 * @this generator
 */
function getRawStore() {
  if (path.extname(this.path) === '.json') {
    return this.fs.readJSON(this.path, {}) || {};
  }
  return yaml.load(this.fs.read(this.path, {}), 'utf8') || {};
}

/**
 * Return the current store as JSON object
 * If the path ends in '.json', treats the file as a JSON file.
 * Otherwise it assumes the file is a YAML file
 *
 * @private
 * @return {Object} the store content for the root generator
 * @this generator
 */
function _store() {
  return getRawStore.call(this)[this.name] || {};
}


/**
 * Persist a configuration to disk as a YAML file
 * @param {Object} val - current configuration values
 * @returns {undefined}
 * @this generator
 */
function _persist(val) {
  let fullStore = getRawStore.call(this);

  fullStore[this.name] = val;

  // Auto-upgrade to YAML from JSON
  if (path.extname(this.path) === '.json') {
    this.path = this.path.replace(/\.json$/, '.yml');
  }
  // console.log('FULLSTORE', fullStore);
  this.fs.write(this.path, yaml.safeDump(fullStore));
}


