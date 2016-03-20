'use strict';

const _ = require('lodash');
const scriptHasShortcut = {start: true, stop: true, test: true, restart: true};

module.exports = {
  defineNpmTask: defineNpmTask,
  addNpmTasks: addNpmTasks,
  getBasePackageName: getBasePackageName,
  setNpmDevDependenciesFromArray: setNpmDevDependenciesFromArray,
  setNpmDependenciesFromArray: setNpmDependenciesFromArray,
  readPackageJson: readPackageJson,
  writePackageJson: writePackageJson
};


function addNpmTasks(arrayOfTaskDefinitions, isUnsupportedMessage) {
  var config = this.getGlobalConfig();
  var self = this;
  (arrayOfTaskDefinitions || []).forEach(item => {
    // The item.tasks can contain EJS template. Convert them now as they will appear only in the package.json, not in the readme doc
    var resolvedTasks = item.tasks.map(taskStr => self.renderEJS(taskStr, config));

    // Verify whether the task is supported or not. If it is not supported, show the unsupported message instead.
    if (isUnsupportedMessage) {
      this.defineNpmTask(item.name, ['echo ' + isUnsupportedMessage], isUnsupportedMessage);
    } else {
      this.defineNpmTask(item.name, resolvedTasks);
    }

    if (item.description) {
      // If the description or features contain EJS templates, addReadmeDoc() will convert them
      this.addReadmeDoc('buildTask.' + item.name, {
        command: 'npm ' + (scriptHasShortcut[item.name] ? '' : 'run ' ) + item.name,
        description: isUnsupportedMessage || item.description,
        features: (isUnsupportedMessage) ? [] : item.features || []
      });
    }
  });
}

/**
 * Defines an NPM Script task. Uses npm-run-all when there are multiple tasks to run.
 * Adds readme info for each script
 * If the scriptName is 'start', 'stop', 'test' or 'restart', the command is `npm <scriptName>`,
 * otherwise it is `npm run <scriptName>`.
 *
 * @param scriptName    The name of the script in the `scripts` section of package.json
 * @param taskArray     A list of tasks to execute (can contain a single task)
 * @param description   An optional description to use for the script. This description will appear in the README.md
 */
function defineNpmTask(scriptName, taskArray, description) {
  var packageJson = readPackageJson.call(this);
  var runner = ((taskArray.length > 1) ? 'npm-run-all ' : '');

  _.set(packageJson, 'scripts.' + scriptName, runner + taskArray.join(' '));
  writePackageJson.call(this, packageJson);

  if (description) {
    this.addReadmeDoc('buildTask.' + scriptName, {
      command: 'npm ' + (scriptHasShortcut[scriptName] ? '' : 'run ' ) + scriptName,
      description: description
    });
  }
}


function readPackageJson() {
  return this.fs.readJSON(this.destinationPath('package.json')) || {};
}

function writePackageJson(data) {
  this.fs.writeJSON(this.destinationPath('package.json'), data);
}


function setNpmDependenciesFromArray(packages) {
  var ctx = { me: this, config: this.getGlobalConfig() };
  setDependenciesFromArray.call(ctx, packages, 'dependencies')
}

function setNpmDevDependenciesFromArray(packages) {
  var ctx = { me: this, config: this.getGlobalConfig() };
  setDependenciesFromArray.call(ctx, packages, 'devDependencies')
}

/**
 * Adds dependencies based on some optional criteria.
 * In order to eval() the criteria, this method is called with a different context:
 * `this = {me: (the parent this), config: this.getGlobalConfig()}`. This allows the
 * `eval(pkg.criteria)` to contain references to `config...` and work correctly.
 *
 * See setNpmDevDependenciesFromArray() for an example of this.
 *
 * @param packages {Object}   A package has a name and a version. If the name contains a '/',
 *                            the string before the '/' is used as the name.
 * @param optKey
 */
function setDependenciesFromArray(packages, optKey) {
  var packagesToAdd = (packages || []).map((pkg) => {
    if (pkg.criteria) {
      //console.log('eval', pkg.criteria, eval(pkg.criteria));
      pkg.isAddDep = eval(pkg.criteria);
    }
    return pkg;
  });

  packagesToAdd.forEach((pkg) => {
    var obj = {};
    obj[getBasePackageName(pkg)] = pkg.version;
    setNpmDependencies.call(this.me, obj, pkg.isAddDep, optKey);
  });
}

function setNpmDependencies(deps, isAddDep, optKey) {
  var packageJson = readPackageJson.call(this);
  var key = optKey || 'dependencies';
  var addDep = (isAddDep === undefined) ? true : !!isAddDep;

  // Create the key in case it doesn't exist
  if (!packageJson[key]) {
    packageJson[key] = {};
  }

  if (addDep) {
    packageJson[key] = _.assign(packageJson[key], deps);
  } else {
    // Remove the dependencies
    packageJson[key] = _.omit(packageJson[key], _.keys(deps));
  }
  writePackageJson.call(this, packageJson);
}

function getBasePackageName(pkg) {
  var pkgIndexOfSlash = pkg.name.indexOf('/');
  return (pkgIndexOfSlash > -1) ? pkg.name.substr(0, pkgIndexOfSlash): pkg.name;
}
