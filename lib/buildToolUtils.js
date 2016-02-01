'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function readYaml(filename) {
  return yaml.safeLoad(fs.readFileSync(filename), 'utf8');
}


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
var buildToolResources = {};    // a cache of buildtool resources

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
    buildToolResources[buildToolName] = readYaml(__dirname + '/../buildTool/' + buildToolName + '/' + buildToolName + 'Resources.yml')
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


(function init() {
  getBuildProfiles();
})();

module.exports = {
  getBuildProfiles: getBuildProfiles,
  toolTemplatePath: getToolTemplatePath,
  updateBuildTool: updateBuildTool
};
