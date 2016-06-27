'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const resourceUtils = require('./resources');

let isInitialized = false;  // Get's set to true once getBuildProfiles(projectType) is called
let buildProfiles = [];       // This is used by the UI, for the user to select from a list of profiles
let buildProfilesMap = {};    // We use the map to find the buildTool for the current generator
let buildToolResources = {};    // a cache of buildtool resources

let buildToolCache = {};              // A chache of build tools e.g. NPM_release, Webpack_serverProd. Only 1 buildTool instance will be stored even though there are many generators per buildTool
let buildToolNameCache = new Set();   // A cache of the buildTool names e.g. NPM, webpack, grunt

module.exports = {
  getBuildProfiles,
  isBuildToolSupported,
  registerBuildToolCommands,
  getToolTemplatePath,
  updateBuildTool,
  writeBuildToolConfig,
  writeGeneratorConfig
};


//---------------------------------- STATIC CODE ---------------------------------------
/**
 * Finds and reads the '*.profile.json' files in the 'projectType' folder, using the projectType of the application.
 * and returns an array of their contents.
 *
 * This approach allows future Confit plugin-writers to define their own build profiles.
 * Do this ONCE for ALL generator instances
 *
 * @returns {Array}
 */
function getBuildProfiles(projectType) {
  if (!buildProfiles.length) {
    var profilePath = path.join(__dirname, '/../projectType/', projectType);
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
  isInitialized = true;
  return buildProfiles;
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
  if (!isInitialized) {
    return;
  }

  let name = this.name;
  let buildTools = (buildProfilesMap[this.getGlobalConfig().app.buildProfile] || {}).toolMap || {};
  let buildToolName = buildTools[name];

  let buildTool = {
    configure: function() {},
    finalizeAll: finalizeAll,
    getResources: function() {
      return buildToolResources[buildToolName];
    },
    isNull: false,
    name: buildToolName,
    write: function() {}
  };

  if (!buildToolName) {
    buildTool.isNull = true;
  } else if (!buildToolResources[buildToolName]) {
    // Cache the buildTool resources if the buildTool exists
    buildToolResources[buildToolName] = resourceUtils.readYaml(__dirname + '/../buildTool/' + buildToolName + '/' + buildToolName + 'Resources.yml');
  }

  try {
    buildTool = _.merge(buildTool, require('../buildTool/' + buildToolName + '/' + name + '/' + name + '.js')());
  } catch(e) {
    //console.log(e);
  }

  buildToolNameCache.add(buildToolName);
  buildToolCache[buildToolName] = buildTool;    // This will overwrite existing buildTools, but that's ok for what we are using it for.
  this.buildTool = buildTool;
  //console.log(name, this.buildTool);
}


/**
 * Called by the App generator after buildTool.write() has been called
 */
function finalizeAll() {
  let oldName = this.name;
  let oldBuildTool = this.buildTool;

  this.name = 'zzzfinalize';    // We have to change the generator name temporarily, for certain functions to work s expected

  buildToolNameCache.forEach(buildToolName => {
    try {
      let finalize = require('../buildTool/' + buildToolName + '/zzzfinalize');
      this.buildTool = buildToolCache[buildToolName];
      finalize.call(this);
    } catch(e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        console.log(e);
      }
    }
  });
  this.name = oldName;
  this.buildTool = oldBuildTool;
}


/**
 * TODO: It would be good to make this function use a path relative to the file from which it is called
 * @param pathSuffix
 * @returns {string}
 */
function getToolTemplatePath(pathSuffix) {
  return __dirname + '/../buildTool/' + this.buildTool.name + '/' + this.name + '/templates/' + pathSuffix;
}


/**
 * Determine if a build tool supports the current configuration.
 * @param resourceKey   An object that may contain the 'unsupported' key.
 * @returns {String}    Returns a message if the tool is NOT supported, or undefined otherwise
 */
function isBuildToolSupported(resourceKey) {
  var unsupportedCriterion = resourceKey.unsupported;
  if (!_.isArray(unsupportedCriterion)) {
    return;
  }

  var config = this.getGlobalConfig();
  var unsupportedErrors = unsupportedCriterion.filter(item => {
    var criteria = item.criteria;
    var key = Object.keys(criteria)[0];   // This should be a reference to a value in the config. E.g. 'buildJS.framwork[0]'
    var expectedValue = criteria[key];
    return _.get(config, key) === expectedValue;
  });

  if (unsupportedErrors.length) {
    return unsupportedErrors[0].message;
  }
}


function registerBuildToolCommands(contextMode, arrayOfCommandsOrPackages) {
  var commands = arrayOfCommandsOrPackages || [];

  commands.forEach(cmd => {
    // If the command is a reference to a package, convert it to a command with arguments
    if (cmd.name && cmd.version) {
      cmd.cmd = 'npm';
      cmd.args = ['install', cmd.name + '@' + cmd.version];
      if (cmd.global) { // If the package is global, add the -g flag
        cmd.args.push('-g');
      }
    }

    // Not great code, but in a hurry...
    if (contextMode === 'install') {
      this.runOnInstall(cmd.cmd, cmd.args);
    } else if (contextMode === 'end') {
      this.runOnEnd(cmd.cmd, cmd.args);
    }
  });
}


function buildConfig(genToolConfig, successCb) {
  if (!genToolConfig) {
    return;
  }
  let unsupportedMessage = this.isBuildToolSupported(genToolConfig);

  // Filter the packages that should be installed globally. We will stick them into an oninstall block
  let globalPackages = (genToolConfig.packages || []).filter(pkg => pkg.global);
  let nonGlobalPackages = (genToolConfig.packages || []).filter(pkg => pkg.global === 'both' || !pkg.global);

  // Now distinguish between dependencies and devDependencies
  let depPackages = nonGlobalPackages.filter(pkg => pkg.isDependency);
  let devDepPackages = nonGlobalPackages.filter(pkg => !pkg.isDependency);

  this.setNpmDependenciesFromArray(depPackages);
  this.setNpmDevDependenciesFromArray(devDepPackages);
  this.addNpmTasks(genToolConfig.tasks, unsupportedMessage);
  this.ts.addTypeLibsFromArray(genToolConfig.typeLibs);
  this.ts.addTypeLibsFromArray(genToolConfig.testTypeLibs);
  this.addNpmConfig(genToolConfig.npmConfig);

  // Modify the onInstall config to include global packages. Make sure they appear FIRST in the list of commands
  let onInstallConfig = globalPackages.concat(genToolConfig.onInstall || []);

  this.registerBuildToolCommands('install', onInstallConfig);
  this.registerBuildToolCommands('end', genToolConfig.onEnd);

  successCb.call(this);
}

/**
 * Reads the config data from a resource file and writes the changes described in the config.
 * Very powerful! Almost all the buildTool write operations can be defined in YAML now.
 * Adds DevDependencies, Tasks (NPM Scripts), NPM Config, Copies files and registers build
 * tool commands that run onInstall or onEnd
 *
 * @param buildToolResourceData   The data containing the build tool tasks, dependencies, config and file instructions
 */
function writeBuildToolConfig(buildToolResourceData, optionalTemplateData) {
  buildConfig.call(this, buildToolResourceData, () => {
    let unsupportedMessage = this.isBuildToolSupported(buildToolResourceData);
    let templateData = _.merge(this.getStandardTemplateData(), optionalTemplateData);

    this.copyToolTemplates(buildToolResourceData.templateFiles, templateData);

    if (!unsupportedMessage) {
      this.addReadmeDoc('', buildToolResourceData.readme, templateData);    // When a key is not specified, it adds the whole object (if not undefined)
    }
  });
}


/**
 * Generator-specific builder
 * @param genResourceData
 */
function writeGeneratorConfig(genResourceData) {
  buildConfig.call(this, genResourceData, () => {
    let templateData = this.getStandardTemplateData();
    this.copyGeneratorTemplates(genResourceData.templateFiles, templateData);
    this.addReadmeDoc('', genResourceData.readme, templateData);    // When a key is not specified, it adds the whole object (if not undefined)
  });
}
