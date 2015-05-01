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


  function addNpmDevDependencies(deps) {
    var filePath = gen.destinationPath('package.json');
    var packageJson = gen.fs.readJSON(filePath);

    packageJson.devDependencies = _.assign(packageJson.devDependencies, deps);
    gen.fs.writeJSON(filePath, packageJson);
  }



  function getBuildTool() {
    var buildToolName = gen.config.get('buildTool') || 'grunt';
    return require('../' + name + '/' + buildToolName + '/' + name + '.js')();
  }


  function getConfig(childKey) {
    return parentConfig[childKey];
  }


  return {
    //addNpmDependencies: addNpmDependencies,
    addNpmDevDependencies: addNpmDevDependencies,
    getBuildTool: getBuildTool,
    getConfig: getConfig
  };
};
