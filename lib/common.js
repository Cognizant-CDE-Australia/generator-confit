'use strict';

var _ = require('lodash');
var checksum = require('checksum');

var GEN_VERSION_PROP = '_version';


module.exports = function(generator) {

  var gen = generator;
  var name = generator.options.namespace.substring('confit:'.length);
  //gen.log('Name = ' + name);

  var genCheckSum = '';
  var genFileName = __dirname + '/../generators/' + name + '/index.js';

  // If there is no existing config, create an empty object
  if (!gen.config.get(name)) {
    //gen.log(name + ' has no existing config!');
    gen.config.set(name, {});
  }

  var done = gen.async();
  checksum.file(genFileName, function(err, checksum) {
    genCheckSum = checksum;
    done();
  });


  function setNpmDependencies(deps, isAddDep, optKey) {
    var filePath = gen.destinationPath('package.json');
    var packageJson = gen.fs.readJSON(filePath);
    var key = optKey || 'dependencies';
    var addDep = (isAddDep === undefined) ? true : !!isAddDep;

    if (addDep) {
      packageJson[key] = _.assign(packageJson[key], deps);
    } else {
      // Remove the dependencies
      packageJson[key] = _.omit(packageJson[key], _.keys(deps))
    }
    gen.fs.writeJSON(filePath, packageJson);
  }

  function setNpmDevDependencies(deps, isAddDep) {
    setNpmDependencies(deps, isAddDep, 'devDependencies');
  }

  function setPackageKey(key, value) {
    var filePath = gen.destinationPath('package.json');
    var packageJson = gen.fs.readJSON(filePath);
    _.set(packageJson, key, value);   // Key can be 'script' or 'script.run' (a path)
    gen.fs.writeJSON(filePath, packageJson);
  }


  function hasExistingConfig() {
    var genConfigVersion = getConfig(GEN_VERSION_PROP) || '';
    //gen.log('Existing config version = ' + genConfigVersion);
    //gen.log('Checksum config version = ' + genCheckSum);
    return genConfigVersion === genCheckSum;
  }

  function getBuildTool() {
    var buildToolName = getGlobalConfig().app.buildTool || 'grunt';
    return require('../buildTool/' + buildToolName + '/' + name + '/' + name + '.js')();
  }

  function getToolTemplatePath(pathSuffix) {
    var buildToolName = getGlobalConfig().app.buildTool;
    return __dirname + '/../buildTool/' + buildToolName + '/' + name + '/templates/' + pathSuffix;
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

    //gen.log(gen.config.get(name));
    return obj;
  }


  return {
    setNpmDependencies: setNpmDependencies,
    setNpmDevDependencies: setNpmDevDependencies,
    demoOutputModuleDir: 'demoModule/',
    hasExistingConfig: hasExistingConfig,
    getBuildTool: getBuildTool,
    getConfig: getConfig,
    getGlobalConfig: getGlobalConfig,
    generateObjFromAnswers: generateObjFromAnswers,
    setConfig: setConfig,
    setPackageKey: setPackageKey,
    toolTemplatePath: getToolTemplatePath,
    versionProperty: GEN_VERSION_PROP
  };
};
