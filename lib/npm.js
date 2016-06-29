'use strict';

const _ = require('lodash');
_.mixin(require('lodash-deep'));
const scriptHasShortcut = {start: true, stop: true, test: true, restart: true};

module.exports = {
  addNpmTasks,
  addPackageJsonConfig,
  getBasePackageName,
  setNpmDevDependenciesFromArray,
  setNpmDependenciesFromArray,
  readPackageJson,
  writePackageJson
};


function addNpmTasks(arrayOfTaskDefinitions, isUnsupportedMessage) {
  let config = this.getGlobalConfig();
  let self = this;
  (arrayOfTaskDefinitions || []).forEach(item => {
    // The item.tasks can contain EJS template. Convert them now as they will appear only in the package.json, not in the readme doc
    var resolvedTasks = item.tasks.map(taskStr => self.renderEJS(taskStr, config));

    // Verify whether the task is supported or not. If it is not supported, show the unsupported message instead.
    defineNpmTask.call(this, item.name, isUnsupportedMessage ? ['echo ' + isUnsupportedMessage] : resolvedTasks);

    if (item.description) {
      //console.log('>>  ', this.name, item.name);
      // If the description or features contain EJS templates, addReadmeDoc() will convert them
      this.addReadmeDoc('buildTask.' + this.name + '.' + item.name, {
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
 */
function defineNpmTask(scriptName, taskArray) {
  var packageJson = readPackageJson.call(this);
  var runner = ((taskArray.length > 1) ? 'npm-run-all ' : '');

  _.set(packageJson, 'scripts.' + scriptName, runner + taskArray.join(' '));
  writePackageJson.call(this, packageJson);
}

/**
 * Adds a key-value to ANY block in package.json
 *
 * @param arrayOfKeyValues {array} [{package.json.path.key: value}, {k: v}, ...]
 */
function addPackageJsonConfig(arrayOfKeyValues) {
  let values = arrayOfKeyValues || [];

  if (values.length === 0) {
    return;
  }

  let packageJson = readPackageJson.call(this);
  let templateData = this.getStandardTemplateData();

  values.forEach((item) => {
    let newItem = this.forEJSInObj(item, templateData);   // Parse any EJS templates in the object
    let key = _.keys(newItem)[0];
    _.set(packageJson, key, newItem[key]);
  });

  writePackageJson.call(this, packageJson);
}

const MINIMUM_VALID_PACKAGE_JSON = {
  description: '',
  name: ''
};

function readPackageJson() {
  return this.fs.readJSON(this.destinationPath('package.json')) || MINIMUM_VALID_PACKAGE_JSON;
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
