'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var path = require('path');
var _ = require('lodash');
var utils = require('./utils');
var checksum = require('checksum');

var GEN_VERSION_PROP = '_version';

//---------------------------------- STATIC CODE ---------------------------------------
/**
 * Finds and reads the '*.profile.json' files in the 'buildTool' folder, and returns an array of their contents.
 * This approach allows future Confit plugin-writers to define their own build profiles.
 * Do this ONCE for ALL generator instances
 *
 * @returns {Array}
 */
function getBuildProfiles() {
  if (!buildProfiles.length) {
    var profilePath = path.join(__dirname, '/../buildTool');
    // Get a list of files that end in 'profile.json' from the buildTool directory
    var files = fs.readdirSync(profilePath)
      .filter(function(file) {
        return fs.statSync(path.join(profilePath, file)).isFile() && (file.match(/\.profile\.json$/) !== null);
      });

    files.forEach(function(file) {
      var data = require(path.join(profilePath, file));
      buildProfiles.push(data);
      buildProfilesMap[data.name] = data;
    });
  }
  return buildProfiles;
}

var buildProfiles = [];       // This is used by the UI, for the user to select from a list of profiles
var buildProfilesMap = {};    // We use the map to find the buildTool for the current generator


function loadResourceFile() {
  //console.log('loading resources...');
  return readYaml(__dirname + '/resources.yml');
}

function readYaml(filename) {
  return yaml.safeLoad(fs.readFileSync(filename), 'utf8');
}
var resources = {};             // a cache of the generator resources
var buildToolResources = {};    // a cache of buildtool resources

(function init() {
  getBuildProfiles();
  resources = loadResourceFile();
})();

//---------------------------------- STATIC CODE END ---------------------------------------


module.exports = function extendGenerator() {

  var gen = this;
  var name = this.options.namespace.substring('confit:'.length);
  var packageFilePath = gen.destinationPath('package.json');

  var genCheckSum = '';
  var genFileName = __dirname + '/../generators/' + name + '/index.js';

  this.setNpmDependencies = setNpmDependencies;
  this.setNpmDevDependenciesFromArray = setNpmDevDependenciesFromArray;
  this.setNpmDependenciesFromArray = setNpmDependenciesFromArray;
  this.hasExistingConfig = hasExistingConfig;
  this.addReadmeDoc = addReadmeDoc;
  this.defineNpmTask = defineNpmTask;
  this.generateObjFromAnswers = generateObjFromAnswers;
  this.getBuildProfiles = getBuildProfiles;
  this.getConfig = getConfig;
  this.getGlobalConfig = getGlobalConfig;
  this.getResources = function () { return resources; };
  this.setConfig = setConfig;
  this.readPackageJson = readPackageJson;
  this.ROOT_GENERATOR_NAME = 'generator-confit';
  this.writePackageJson = writePackageJson;
  this.updateBuildTool = updateBuildTool;
  this.toolTemplatePath = getToolTemplatePath;


  (function init() {
    // If there is no existing config, create an empty object
    if (!gen.config.get(name)) {
      //console.log(name + ' has no existing config!');
      gen.config.set(name, {});
    }

    gen.appPackageName = _.kebabCase(gen.appname);

    // Create a checksum for this generator. If the checksum is different, it means the generator was changed from
    // when it was lasted used to produce the confit.json file. In which case, we consider the existing config to be
    // OLD, and we will attempt to recreate it.
    var done = gen.async();   // This delays the current Yeoman step until such time as done() is called. E.g.: Wait for preInit() to happen before executing init() step.
    checksum.file(genFileName, function(err, checksum) {
      genCheckSum = checksum;
      done();
    });
    updateBuildTool.apply(gen);

    // Make sure that the skipInstall flag is set correctly, otherwise we will still be trying to install things!
    gen.options.skipInstall = gen.options['skip-install'];
  })();


  function setNpmDependencies(deps, isAddDep, optKey) {
    var packageJson = readPackageJson();
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
    writePackageJson(packageJson);
  }


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
      obj[pkg.name] = pkg.version;
      setNpmDependencies(obj, pkg.isAddDep, optKey);
    });
  }

  function setNpmDependenciesFromArray(packages) {
    var ctx = { config: gen.getGlobalConfig() };
    setDependenciesFromArray.call(ctx, packages, 'dependencies')
  }

  function setNpmDevDependenciesFromArray(packages) {
    var ctx = { config: gen.getGlobalConfig() };
    setDependenciesFromArray.call(ctx, packages, 'devDependencies')
  }



  /**
   * Adds fragments of text to a temporary store, which will be used later to generate a README.md file
   *
   * @param readmeSubKey {String}         A key to store the text within the data structure, until it is rendered in README.md
   * @param strOrObj {Object|String}      The text to render. It is treated as an EJS template string
   * @param extraData {Object}(optional)  Extra data to apply to the txt-template. By default, the template can see all the Confit configuration data
   */
  function addReadmeDoc(readmeSubKey, strOrObj, extraData) {
    var packageJson = readPackageJson();
    var data = _.merge({}, getGlobalConfig(), { configFile: gen.configFile }, extraData);
    var value;

    // Parse strOrObj as a string or as an object. If object, run EJS over each property
    if (_.isString(strOrObj)) {
      value = utils.renderEJS(strOrObj.trim(), data);
    } else {
      value = _.mapValues(strOrObj, function(propValue) {
        return utils.renderEJS(propValue.toString().trim(), data);
      })
    }
    _.set(packageJson, 'config.readme.' + readmeSubKey, value);
    writePackageJson(packageJson);
  }


  var scriptHasShortcut = {start: true, stop: true, test: true, restart: true};
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
    var packageJson = readPackageJson();
    var runner = ((taskArray.length > 1) ? 'npm-run-all ' : '');

    _.set(packageJson, 'scripts.' + scriptName, runner + taskArray.join(' '));
    writePackageJson(packageJson);

    // Temporarily store the descriptions in config.readme
    if (description) {
      addReadmeDoc('buildTask.' + scriptName, {
        command: 'npm ' + (scriptHasShortcut[scriptName] ? '' : 'run ' ) + scriptName,
        description: description
      });
    }
  }


  function hasExistingConfig() {
    var genConfigVersion = getConfig(GEN_VERSION_PROP) || '';
    //gen.log('Existing config version = ' + genConfigVersion);
    //gen.log('Checksum config version = ' + genCheckSum);
    return genConfigVersion === genCheckSum;
  }


  function readPackageJson() {
    return gen.fs.readJSON(packageFilePath);
  }

  function writePackageJson(data) {
    gen.fs.writeJSON(packageFilePath, data);
  }

  /**
   * Re-sets the build tool for the current generator. For example,
   * if the current generator is 'buildCSS', and the build profile has this mapping: 'buildCSS': 'toolName',
   * then this function will `require('buildTool/toolName/buildCSS/buildCSS.js')()`
   *
   * If the toolName is blank (which it may be for certain implementations), it returns a no-op buildTool.
   *
   * @returns {Object} - Build tool object with a write() method
   */
  function updateBuildTool() {
    var buildTools = (buildProfilesMap[getGlobalConfig().app.buildProfile] || {}).toolMap || {};
    var buildToolName = buildTools[name];
    var buildTool = {
      configure: function() {},
      write: function() {},
      getResources: function() {
        return buildToolResources[buildToolName];
      }
    };

    if (!buildToolName) {
      buildTool.isNull = true;
    } else if (!buildToolResources[buildToolName]) {
      // Cache the buildTool resources if the buildTool exists
      buildToolResources[buildToolName] = readYaml(__dirname + '/../buildTool/' + buildToolName + '/' + buildToolName + 'Resources.yml')
    }

    try {
      buildTool = _.merge(buildTool, require('../buildTool/' + buildToolName + '/' + name + '/' + name + '.js')());
    } catch(e) {}

    this.buildTool = buildTool;
  }

  function getToolTemplatePath(pathSuffix) {
    var buildTools = buildProfilesMap[getGlobalConfig().app.buildProfile].toolMap;
    var buildToolName = buildTools[name];
    return __dirname + '/../buildTool/' + buildToolName + '/' + name + '/templates/' + pathSuffix;
  }


  function getConfig(childKey) {
    // If there is no childKey, return the parentConfig
    var config = gen.config.get(name);
    if (!childKey) {
      return config;
    }
    return _.get(config, childKey);   // Supports getConfig('key.a.b');
  }


  function getGlobalConfig() {
    return gen.config.getAll();
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
    obj[name][GEN_VERSION_PROP] = genCheckSum;

    gen.config.set(obj);

    return obj;
  }
};
