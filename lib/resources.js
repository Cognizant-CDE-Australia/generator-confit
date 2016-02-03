'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

let resources = loadResourceFile();

function loadResourceFile() {
  //console.log('loading resources...');
  return readYaml(__dirname + '/resources.yml');
}

function readYaml(filename) {
  return yaml.safeLoad(fs.readFileSync(filename), 'utf8');
}

function getResources() {
  return resources;
}

module.exports = {
  getResources: getResources
};
