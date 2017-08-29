'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');
const path = require('path');

module.exports = {
  initResources,
  getResources,
  readYaml,
};


let resources; // Static - we want to cache this.

/**
 * Initialises the resources object ONCE
 *
 * @param {string} projectType    The project type (Browser/Node)
 * @param {Boolean} force         If the resourcee object has already been initialised, setting this to true will force it to be re-initialised
 */
function initResources(projectType, force) {
  if (!resources || force) {
    // console.log('Initialising project resources');
    let packageList = fs.readFileSync(path.join(__dirname, '/packages.yml'), 'utf8');
    let baseResources = fs.readFileSync(path.join(__dirname, '/resources.yml'), 'utf8');
    let projectResources = projectType ? fs.readFileSync(path.join(__dirname, '/../projectType/' + projectType + '/' + projectType + 'Resources.yml'), 'utf8') : '';

    resources = yaml.load(packageList + '\n' + baseResources, 'utf8');
    _.merge(resources, yaml.load(packageList + '\n' + projectResources));
  }
}

/**
 * Reads a specified YAML file and attaches packages.yml to it to allow the file to access the package-variables in packages.yml
 * @param {String} filename   YAML file to load
 * @return {Object}           JS object loaded from YAML definition
 */
function readYaml(filename) {
  // Decorate the YAML file with the list of packages, to allow anchor references to be used
  let packageList = fs.readFileSync(path.join(__dirname, '/packages.yml'), 'utf8');
  let mainFile = fs.readFileSync(filename, 'utf8');

  return yaml.load(packageList + '\n' + mainFile, 'utf8');
}

/**
 * Get's the resources object
 * @return {Object}    A copy of the resources object
 */
function getResources() {
  return Object.assign({}, resources);
}


