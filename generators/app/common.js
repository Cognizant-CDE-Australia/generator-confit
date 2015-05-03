'use strict';

var chalk = require('chalk');
var _ = require('lodash');

module.exports = function(generator, genName) {

  var gen = generator;
  var name = genName;
  var parentConfig = (name !== 'app') ? gen.config.get(name) : gen.config.getAll();

  if (!parentConfig && name !== 'app') {
    //gen.env.error(chalk.red('Please run "yo ngwebapp" to generate an initial config!'));
    //return;
    gen.config.set(name, {});
    parentConfig = gen.config.get(name);
  }

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


  function getBuildTool() {
    var buildToolName = gen.config.get('buildTool') || 'grunt';
    return require('../' + name + '/' + buildToolName + '/' + name + '.js')();
  }


  function getConfig(childKey) {
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

    gen.config.set(obj);
    return obj;
  }


  return {
    addNpmDependencies: addNpmDependencies,
    addNpmDevDependencies: addNpmDevDependencies,
    getBuildTool: getBuildTool,
    getConfig: getConfig,
    generateObjFromAnswers: generateObjFromAnswers,
    setConfig: setConfig
  };
};
