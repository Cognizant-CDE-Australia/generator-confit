'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

let resources = loadResourceFile();

function loadResourceFile() {
  //console.log('loading resources...');
  return readYaml(__dirname + '/resources.yml');
}

function readYaml(filename) {
  // Decorate the YAML file with the list of packages, to allow anchor references to be used
  var packageList = fs.readFileSync(__dirname + '/packages.yml', 'utf8');
  var mainFile = fs.readFileSync(filename, 'utf8');

  return yaml.load(packageList + '\n' + mainFile, 'utf8');
}

function getResources() {
  return resources;
}

module.exports = {
  getResources: getResources,
  readYaml: readYaml
};
