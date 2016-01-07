'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
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
var configFile;


(function init() {
  getBuildProfiles();
})();

//---------------------------------- STATIC CODE ---------------------------------------


module.exports = function(generator) {

  var gen = generator;
  var name = generator.options.namespace.substring('confit:'.length);
  var packageFilePath = gen.destinationPath('package.json');

  var genCheckSum = '';
  var genFileName = __dirname + '/../generators/' + name + '/index.js';

  // If there is no existing config, create an empty object
  if (!gen.config.get(name)) {
    console.log(name + ' has no existing config!');
    gen.config.set(name, {});
  }

  // Create a checksum for this generator. If the checksum is different, it means the generator was changed from
  // when it was lasted used to produce the confit.json file. In which case, we consider the existing config to be
  // OLD, and we will attempt to recreate it.
  var done = gen.async();
  checksum.file(genFileName, function(err, checksum) {
    genCheckSum = checksum;
    done();
  });



  function setNpmDependencies(deps, isAddDep, optKey) {
    var packageJson = readPackageJson();
    var key = optKey || 'dependencies';
    var addDep = (isAddDep === undefined) ? true : !!isAddDep;

    if (addDep) {
      packageJson[key] = _.assign(packageJson[key], deps);
    } else {
      // Remove the dependencies
      packageJson[key] = _.omit(packageJson[key], _.keys(deps))
    }
    writePackageJson(packageJson);
  }

  function setNpmDevDependencies(deps, isAddDep) {
    setNpmDependencies(deps, isAddDep, 'devDependencies');
  }


  /**
   * Defines an NPM Script task. Uses npm-run-all when there are multiple tasks to run
   *
   * @param scriptName
   * @param taskArray
   * @param description
   */
  function defineNpmTask(scriptName, taskArray, description) {
    var packageJson = readPackageJson();
    var runner = ((taskArray.length > 1) ? 'npm-run-all ' : '');

    _.set(packageJson, 'scripts.' + scriptName, runner + taskArray.join(' '));

    // Temporarily store the descriptions in config.readme
    if (description) {
      _.set(packageJson, 'config.readme.' + scriptName, description);
    }
    writePackageJson(packageJson);
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
   * Returns the build tool for the current generator. For example,
   * if the current generator is 'buildCSS', and the build profile has this mapping: 'buildCSS': 'toolName',
   * then this function will `require('buildTool/toolName/buildCSS/buildCSS.js')()`
   *
   * If the toolName is blank (which it may be for certain implementations), it returns a no-op buildTool.
   *
   * @returns {Object} - Build tool object with a write() method
   */
  function getBuildTool() {
    var buildTools = buildProfilesMap[getGlobalConfig().app.buildProfile].toolMap;
    var buildToolName = buildTools[name];
    var buildTool = {
      writeConfig: function() {},
      write: function() {}
    };

    if (!buildToolName) {
      return buildTool;
    }

    try {
      buildTool = _.merge(buildTool, require('../buildTool/' + buildToolName + '/' + name + '/' + name + '.js')());
    } catch(e) {}

    return buildTool;
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

    //gen.log(gen.config.get(name));
    return obj;
  }


  return {
    setNpmDependencies: setNpmDependencies,
    setNpmDevDependencies: setNpmDevDependencies,
    hasExistingConfig: hasExistingConfig,
    defineNpmTask: defineNpmTask,
    getBuildProfiles: getBuildProfiles,
    getBuildTool: getBuildTool,
    getConfig: getConfig,
    getGlobalConfig: getGlobalConfig,
    generateObjFromAnswers: generateObjFromAnswers,
    setConfig: setConfig,
    readPackageJson: readPackageJson,
    writePackageJson: writePackageJson,
    configFile: configFile,
    toolTemplatePath: getToolTemplatePath,
    versionProperty: GEN_VERSION_PROP
  };
};
