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

/**
 * Adds NPM tasks from an array of task descriptions
 *
 * @param {Object[]} arrayOfTaskDefinitions   Array of task definitions
 * @param {string} isUnsupportedMessage       A message to display if the task is not supported
 * @this generator
 */
function addNpmTasks(arrayOfTaskDefinitions, isUnsupportedMessage) {
  let templateData = this.getStandardTemplateData();
  let self = this;

  (arrayOfTaskDefinitions || []).forEach(item => {
    // The item.tasks can contain EJS template. Convert them now as they will appear only in the package.json, not in the readme doc
    let resolvedTasks = item.tasks.map(taskStr => self.renderEJS(taskStr, templateData));

    // Verify whether the task is supported or not. If it is not supported, show the unsupported message instead.
    defineNpmTask.call(this, item.name, isUnsupportedMessage ? ['echo ' + isUnsupportedMessage] : resolvedTasks);

    if (item.description) {
      // console.log('>>  ', this.name, item.name);
      // If the description or features contain EJS templates, addReadmeDoc() will convert them
      this.addReadmeDoc('buildTask.' + this.name + '.' + item.name, {
        command: 'npm ' + (scriptHasShortcut[item.name] ? '' : 'run ') + item.name,
        description: isUnsupportedMessage || item.description,
        features: isUnsupportedMessage ? [] : item.features || []
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
 * @param {string} scriptName    The name of the script in the `scripts` section of package.json
 * @param {Object[]} taskArray     A list of tasks to execute (can contain a single task)
 * @this generator
 */
function defineNpmTask(scriptName, taskArray) {
  let packageJson = readPackageJson.call(this);
  let runner = taskArray.length > 1 ? 'npm-run-all ' : '';

  _.set(packageJson, 'scripts.' + scriptName, runner + taskArray.join(' '));
  writePackageJson.call(this, packageJson);
}

/**
 * Adds a key-value to ANY block in package.json
 *
 * @param {Object[]} arrayOfKeyValues  [{package.json.path.key: value}, {k: v}, ...].
 * @this generator
 */
function addPackageJsonConfig(arrayOfKeyValues) {
  let values = arrayOfKeyValues || [];

  if (values.length === 0) {
    return;
  }

  let packageJson = readPackageJson.call(this);
  let templateData = this.getStandardTemplateData();

  values.forEach(item => {
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

/**
 *
 * @return {Object|{description: string, name: string}}    Package JSON object
 * @this generator
 */
function readPackageJson() {
  return this.fs.readJSON(this.destinationPath('package.json')) || MINIMUM_VALID_PACKAGE_JSON;
}

/**
 *
 * @param {Object} data   Object to store inside package.json
 * @this generator
 */
function writePackageJson(data) {
  this.fs.writeJSON(this.destinationPath('package.json'), data);
}

/**
 * Set NPM dependencies from an array
 * @param {Object[]} packages   Array of packages
 * @this generator
 */
function setNpmDependenciesFromArray(packages) {
  let ctx = {me: this, config: this.getGlobalConfig()};

  setDependenciesFromArray.call(ctx, packages, 'dependencies');
}

/**
 * Set NPM dev-dependencies from an array
 * @param {Object[]} packages   Array of packages
 * @this generator
 */
function setNpmDevDependenciesFromArray(packages) {
  let ctx = {me: this, config: this.getGlobalConfig()};

  setDependenciesFromArray.call(ctx, packages, 'devDependencies');
}

/**
 * Adds dependencies based on some optional criteria.
 * In order to eval() the criteria, this method is called with a different context:
 * `this = {me: (the parent this), config: this.getGlobalConfig()}`. This allows the
 * `eval(pkg.criteria)` to contain references to `config...` and work correctly.
 *
 * See setNpmDevDependenciesFromArray() for an example of this.
 *
 * @param {Object[]} packages   The array can contain arrays, so flatten it first.
 *                              A package has a name and a version. If the name contains a '/',
 *                              the string before the '/' is used as the name.
 *                              The package could also be a relative file reference, starting with './'. Ignore these.
 * @param {string} optKey       Defaults to 'dependencies', but can also be 'devDependencies'
 * @this generator
 */
function setDependenciesFromArray(packages, optKey) {
  let packagesToAdd = (packages || []).map(pkg => {
    if (pkg.criteria) {
      // console.log('eval', pkg.criteria, eval(pkg.criteria));
      pkg.isAddDep = eval(pkg.criteria);      // eslint-disable-line no-eval
    }
    return pkg;
  });

  _.flattenDeep(packagesToAdd).forEach(pkg => {
    let obj = {};

    // Only add packages that are NPM packages (which have name properties), not relativePath files (starting with './')
    if (pkg.name) {
      obj[getBasePackageName(pkg)] = pkg.version;
      setNpmDependencies.call(this.me, obj, pkg.isAddDep, optKey);
    }
  });
}

/**
 * Add/remove dependencies to the package.json file
 * @param {Object} deps         NPM package names
 * @param {boolean} isAddDep    Whether to add or remove the dependency
 * @param {string} optKey       Defaults to 'dependencies', but can also be 'devDependencies'
 * @this generator
 */
function setNpmDependencies(deps, isAddDep, optKey) {
  let packageJson = readPackageJson.call(this);
  let key = optKey || 'dependencies';
  let addDep = isAddDep === undefined ? true : Boolean(isAddDep);

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

/**
 * Returns the base package name for a package definition.
 * Sometimes the package definition looks like this: baseName/subPackageName
 * To install the package, we just need th baseName fragment of the package name.
 *
 * @param {Object} pkg    Package name object {name: 'string/optionalPath', ...}
 * @return {string}  Base package name
 */
function getBasePackageName(pkg) {
  let pkgIndexOfSlash = pkg.name.indexOf('/');

  return pkgIndexOfSlash > -1 ? pkg.name.substr(0, pkgIndexOfSlash) : pkg.name;
}
