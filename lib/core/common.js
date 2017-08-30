'use strict';

const _ = require('lodash');
const checksum = require('hash-files');
const sortKeys = require('sort-keys');
const GEN_VERSION_PROP = '_version';
const path = require('path');


module.exports = function extendGenerator() {
  let gen = this;
  let name = this.options.namespace.substring('confit:'.length);

  let genCheckSum = '';
  let genFileName = path.join(__dirname, '/../generators/', name, '/index.js');

  this.name = name;
  this.hasExistingConfig = hasExistingConfig;
  this.generateObjFromAnswers = generateObjFromAnswers;
  this.getConfig = getConfig;
  this.getGlobalConfig = getGlobalConfig;
  this.setConfig = setConfig;

  (function init() {
    // If there is no existing config, create an empty object
    if (!gen.config.get(name)) {
      // console.log(name + ' has no existing config!');
      gen.config.set(name, {});
    }

    gen.appPackageName = _.kebabCase(gen.appname);

    // Create a checksum for this generator. If the checksum is different, it means the generator was changed from
    // when it was lasted used to produce the confit.yml file. In which case, we consider the existing config to be
    // OLD, and we will attempt to recreate it.

    genCheckSum = checksum.sync({
      files: [genFileName],
      noGlob: true,
    });
    gen.updateBuildTool();

    // Make sure that the skipInstall flag is set correctly, otherwise we will still be trying to install things!
    gen.options.skipInstall = gen.options['skip-install'];
  })();


  /**
   * Checks if there is an existing configuration
   * @return {boolean}   Returns true if there is existing configuration that has the same checksum.
   */
  function hasExistingConfig() {
    let genConfigVersion = getConfig(GEN_VERSION_PROP) || '';

    // gen.log('Existing config version = ' + genConfigVersion);
    // gen.log('Checksum config version = ' + genCheckSum);
    return genConfigVersion === genCheckSum;
  }


  /**
   * Returns the configuration for the generator
   * @param {path} [childKey]   Path to the child property to return from the config e.g.: 'a.b.c'
   * @return {*}                The value of the config (or child property)
   */
  function getConfig(childKey) {
    // If there is no childKey, return the parentConfig
    let config = gen.config.get(name);

    if (!childKey) {
      return config;
    }
    return _.get(config, childKey); // Supports getConfig('key.a.b');
  }


  /**
   * Get the config for the root generator (everything)
   * @return {*}     Config object
   */
  function getGlobalConfig() {
    return gen.config.getAll();
  }


  /**
   * Sets the config for the current generator. The generator checksum is re-added to the config.
   * @param {Object} newConfig    The new config to use
   * @return {Object}            The new value of the config
   */
  function setConfig(newConfig) {
    let obj = {};

    obj[name] = newConfig;
    obj[name][GEN_VERSION_PROP] = genCheckSum;

    gen.config.set(sortKeys(obj, {deep: true}));
    return obj;
  }
};


/**
 * Convert a key-value object where the keys can be paths, to a full-blown object.
 *
 * @param {Object} answers  A key-value object, where the keys can be paths like 'a.b.c'
 * @return {Object}        An object that takes each answer-key ('a.b.c') and creates an object {a: {b: {c: answer-value}}}
 */
function generateObjFromAnswers(answers) {
  let result = {};

  Object.keys(answers).forEach((key) => {
    result = _.set(result, key, answers[key]);
  });

  return result;
}
