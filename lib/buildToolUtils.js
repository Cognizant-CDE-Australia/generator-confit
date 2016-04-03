'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const resourceUtils = require('./resources');

let buildProfiles = [];       // This is used by the UI, for the user to select from a list of profiles
let buildProfilesMap = {};    // We use the map to find the buildTool for the current generator
let buildToolResources = {};    // a cache of buildtool resources

let buildToolCache = {};              // A chache of build tools e.g. NPM_release, Webpack_serverProd. Only 1 buildTool instance will be stored even though there are many generators per buildTool
let buildToolNameCache = new Set();   // A cache of the buildTool names e.g. NPM, webpack, grunt

module.exports = {
  getBuildProfiles: getBuildProfiles,
  isBuildToolSupported: isBuildToolSupported,
  registerBuildToolCommands: registerBuildToolCommands,
  toolTemplatePath: getToolTemplatePath,
  updateBuildTool: updateBuildTool,
  writeBuildToolConfig: writeBuildToolConfig
};

// Do immediately
(function init() {
  getBuildProfiles();
})();

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
 * TODO: It would be goot to make this function use a path relative to the file from which it is called
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
    // If the command is a reference to a global package, convert it to a command with arguments
    if (cmd.name && cmd.version && cmd.global) {
      cmd.cmd = 'npm';
      cmd.args = ['install', '-g', cmd.name + '@' + cmd.version];
    }

    // Not great code, but in a hurry...
    if (contextMode === 'install') {
      this.runOnInstall(cmd.cmd, cmd.args);
    } else if (contextMode === 'end') {
      this.runOnEnd(cmd.cmd, cmd.args);
    }
  });
}


/**
 * Reads the config data from a resource file and writes the changes described in the config.
 * Very powerful! Almost all the buildTool write operations can be defined in YAML now.
 * Adds DevDependencies, Tasks (NPM Scripts), NPM Config, Copies files and registers build
 * tool commands that run onInstall or onEnd
 *
 * @param buildToolResourceData   The data containing the build tool tasks, dependencies, config and file instructions
 */
function writeBuildToolConfig(buildToolResourceData) {
  let unsupportedMessage = this.isBuildToolSupported(buildToolResourceData);

  this.setNpmDevDependenciesFromArray(buildToolResourceData.packages);
  this.addNpmTasks(buildToolResourceData.tasks, unsupportedMessage);
  this.ts.addTypeLibsFromArray(buildToolResourceData.typeLibs);
  this.addNpmConfig(buildToolResourceData.npmConfig);
  this.copyToolTemplates(buildToolResourceData.templateFiles);
  if (!unsupportedMessage) {
    this.addReadmeDoc('', buildToolResourceData.readme);    // When a key is not specified, it adds the whole object (if not undefined)
  }

  this.registerBuildToolCommands('install', buildToolResourceData.onInstall);
  this.registerBuildToolCommands('end', buildToolResourceData.onEnd);
}
