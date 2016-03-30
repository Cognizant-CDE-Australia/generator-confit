'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const resourceUtils = require('./resources');

let buildProfiles = [];       // This is used by the UI, for the user to select from a list of profiles
let buildProfilesMap = {};    // We use the map to find the buildTool for the current generator
let buildToolResources = {};    // a cache of buildtool resources

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
  var name = this.name;
  var buildTools = (buildProfilesMap[this.getGlobalConfig().app.buildProfile] || {}).toolMap || {};
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
    buildToolResources[buildToolName] = resourceUtils.readYaml(__dirname + '/../buildTool/' + buildToolName + '/' + buildToolName + 'Resources.yml')
  }

  try {
    buildTool = _.merge(buildTool, require('../buildTool/' + buildToolName + '/' + name + '/' + name + '.js')());
  } catch(e) {
    //console.log(e);
  }

  this.buildTool = buildTool;
}


function getToolTemplatePath(pathSuffix) {
  var buildTools = buildProfilesMap[this.getGlobalConfig().app.buildProfile].toolMap;
  var buildToolName = buildTools[this.name];
  return __dirname + '/../buildTool/' + buildToolName + '/' + this.name + '/templates/' + pathSuffix;
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
 * @param buildToolResourceData
 */
function writeBuildToolConfig(buildToolResourceData) {
  var unsupportedMessage = this.isBuildToolSupported(buildToolResourceData);

  this.setNpmDevDependenciesFromArray(buildToolResourceData.packages);
  this.addNpmTasks(buildToolResourceData.tasks, unsupportedMessage);
  this.addNpmConfig(buildToolResourceData.npmConfig);
  this.copyToolTemplates(buildToolResourceData.templateFiles);

  this.registerBuildToolCommands('install', buildToolResourceData.onInstall);
  this.registerBuildToolCommands('end', buildToolResourceData.onEnd);
}
