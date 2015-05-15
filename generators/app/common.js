'use strict';

var _ = require('lodash');
var checksum = require('checksum');

var GEN_VERSION_PROP = '_version';


module.exports = function(generator, genName) {

  var gen = generator;
  var name = genName;
  var genCheckSum = '';

  var genFileName = __dirname + '/../' + name + '/index.js';
  var parentConfig = gen.config.get(name);

  if (!parentConfig) {
    //gen.log(name + ' has no existing config!');
    gen.config.set(name, {});
    parentConfig = gen.config.get(name);
  }

  var done = gen.async();
  checksum.file(genFileName, function(err, checksum) {
    genCheckSum = checksum;
    done();
  });


  function addNpmDependencies(deps, optKey) {
    var filePath = gen.destinationPath('package.json');
    var packageJson = gen.fs.readJSON(filePath);
    var key = optKey || 'dependencies';

    packageJson[key] = _.assign(packageJson[key], deps);
    gen.fs.writeJSON(filePath, packageJson);
  }

  function addNpmDevDependencies(deps) {
    addNpmDependencies(deps, 'devDependencies');
  }


  function hasExistingConfig() {
    var genConfigVersion = getConfig(GEN_VERSION_PROP) || '';
    //gen.log('Existing config version = ' + genConfigVersion);
    return genConfigVersion === genCheckSum;
  }


  function getBuildTool() {
    var buildToolName = gen.config.get('app.buildTool') || 'grunt';
    return require('../' + name + '/' + buildToolName + '/' + name + '.js')();
  }


  function getConfig(childKey) {
    // If there is no childKey, return the parentConfig
    if (!childKey) {
      return parentConfig;
    }
    return _.get(parentConfig, childKey);   // Supports getConfig('key.a.b');
  }

  function generateObjFromAnswers(answers) {
    var obj = {};

    for (var key in answers) {
      // Split key-string by '.', and generate object graph
      var parts = key.split('.');
      var curObj = obj;
      var part;

      while (parts.length) {
        part = parts.shift();

        // If the part does not exist on the object, and there is another part to come, create it as an object
        if (!curObj[part] && parts.length) {
          curObj[part] = {};
        }
        if (parts.length) {
          curObj = curObj[part];
        }
      }
      curObj[part] = answers[key];
    }
    return obj;
  }


  function setConfig(newConfig) {
    var obj = {};

    obj[name] = newConfig;
    obj[name][GEN_VERSION_PROP] = genCheckSum;

    gen.config.set(obj);
    return obj;
  }


  return {
    addNpmDependencies: addNpmDependencies,
    addNpmDevDependencies: addNpmDevDependencies,
    hasExistingConfig: hasExistingConfig,
    getBuildTool: getBuildTool,
    getConfig: getConfig,
    generateObjFromAnswers: generateObjFromAnswers,
    setConfig: setConfig,
    versionProperty: GEN_VERSION_PROP
  };
};
