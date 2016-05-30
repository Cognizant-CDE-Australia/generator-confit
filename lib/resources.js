'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');

module.exports = {
  initResources,
  getResources,
  readYaml
};


let resources;    // Static - we want to cache this.

function initResources(projectType, force) {
  if (!resources || force) {
    //console.log('Initialising project resources');
    let packageList = fs.readFileSync(__dirname + '/packages.yml', 'utf8');
    let baseResources = fs.readFileSync(__dirname + '/resources.yml', 'utf8');
    let projectResources = (projectType) ? fs.readFileSync(__dirname + '/../projectType/' + projectType + '/' + projectType + 'Resources.yml', 'utf8') : '';

    resources = yaml.load(packageList + '\n' + baseResources, 'utf8');
    _.merge(resources, yaml.load(packageList + '\n' + projectResources));
  }
}

function readYaml(filename) {
  // Decorate the YAML file with the list of packages, to allow anchor references to be used
  let packageList = fs.readFileSync(__dirname + '/packages.yml', 'utf8');
  let mainFile = fs.readFileSync(filename, 'utf8');

  return yaml.load(packageList + '\n' + mainFile, 'utf8');
}

function getResources() {
  return resources;
}


