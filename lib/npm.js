'use strict';

const _ = require('lodash');
const scriptHasShortcut = {start: true, stop: true, test: true, restart: true};

module.exports = {
  addReadmeDoc: addReadmeDoc,
  defineNpmTask: defineNpmTask,
  getBasePackageName: getBasePackageName,
  setNpmDevDependenciesFromArray: setNpmDevDependenciesFromArray,
  setNpmDependenciesFromArray: setNpmDependenciesFromArray,
  readPackageJson: readPackageJson,
  writePackageJson: writePackageJson
};


/**
 * Adds fragments of text to a temporary store, which will be used later to generate a README.md file
 *
 * @param readmeSubKey {String}         A key to store the text within the data structure, until it is rendered in README.md
 * @param strOrObj {Object|String}      The text to render. It is treated as an EJS template string
 * @param extraData {Object}(optional)  Extra data to apply to the txt-template. By default, the template can see all the Confit configuration data
 */
function addReadmeDoc(readmeSubKey, strOrObj, extraData) {
  var packageJson = readPackageJson.call(this);
  var data = _.merge({}, this.getGlobalConfig(), { configFile: this.configFile }, extraData);
  var value;

  // Parse strOrObj as a string or as an object. If object, run EJS over each property
  if (_.isString(strOrObj)) {
    value = this.renderEJS(strOrObj.trim(), data);
  } else {
    value = _.mapValues(strOrObj, propValue => this.renderEJS(propValue.toString().trim(), data));
  }
  _.set(packageJson, 'config.readme.' + readmeSubKey, value);
  writePackageJson.call(this, packageJson);
}



/**
 * Defines an NPM Script task. Uses npm-run-all when there are multiple tasks to run.
 * Creates a config.readme.<scriptName> key, with a {command, description} object.
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

  // Temporarily store the descriptions in config.readme
  if (description) {
    addReadmeDoc.call(this, 'buildTask.' + scriptName, {
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
  var packagesToAdd = packages.map((pkg) => {
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
