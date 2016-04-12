'use strict';

const _ = require('lodash');
const checksum = require('checksum');
const GEN_VERSION_PROP = '_version';


module.exports = function extendGenerator() {
  var gen = this;
  var name = this.options.namespace.substring('confit:'.length);

  var genCheckSum = '';
  var genFileName = __dirname + '/../generators/' + name + '/index.js';

  this.name = name;
  this.hasExistingConfig = hasExistingConfig;
  this.generateObjFromAnswers = generateObjFromAnswers;
  this.getConfig = getConfig;
  this.getGlobalConfig = getGlobalConfig;
  this.setConfig = setConfig;

  (function init() {
    // If there is no existing config, create an empty object
    if (!gen.config.get(name)) {
      //console.log(name + ' has no existing config!');
      gen.config.set(name, {});
    }

    gen.appPackageName = _.kebabCase(gen.appname);

    // Create a checksum for this generator. If the checksum is different, it means the generator was changed from
    // when it was lasted used to produce the confit.json file. In which case, we consider the existing config to be
    // OLD, and we will attempt to recreate it.
    var done = gen.async();   // This delays the current Yeoman step until such time as done() is called. E.g.: Wait for preInit() to happen before executing init() step.
    checksum.file(genFileName, function(err, checksum) {
      genCheckSum = checksum;
      done();
    });
    gen.updateBuildTool();

    // Make sure that the skipInstall flag is set correctly, otherwise we will still be trying to install things!
    gen.options.skipInstall = gen.options['skip-install'];
  })();




  function hasExistingConfig() {
    var genConfigVersion = getConfig(GEN_VERSION_PROP) || '';
    //gen.log('Existing config version = ' + genConfigVersion);
    //gen.log('Checksum config version = ' + genCheckSum);
    return genConfigVersion === genCheckSum;
  }


  function getConfig(childKey) {
    // If there is no childKey, return the parentConfig
    var config = gen.config.get(name);
    if (!childKey) {
      return config;
    }
    return _.get(config, childKey);   // Supports getConfig('key.a.b');
  }


  function getGlobalConfig() {
    return gen.config.getAll();
  }


  function setConfig(newConfig) {
    let obj = {};

    obj[name] = newConfig;
    obj[name][GEN_VERSION_PROP] = genCheckSum;

    gen.config.set(obj);
    return obj;
  }
};


/**
 * Convert a key-value object where the keys can be paths, to a full-blown object.
 *
 * @param answers{Object}  A key-value object, where the keys can be paths like 'a.b.c'
 * @returns {Object}
 */
function generateObjFromAnswers(answers) {
  let result = {};

  Object.keys(answers).forEach((key) => {
    result = _.set(result, key, answers[key]);
  });

  return result;
}
