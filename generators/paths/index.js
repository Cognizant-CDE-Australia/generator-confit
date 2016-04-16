'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');
const path = require('path');

let defaultPaths;

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;

      let resources = this.getResources().paths;

      defaultPaths = _.merge({}, resources.defaults, this.getConfig());
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig || this.useDefaults) {
      return;
    }

    this.log(chalk.underline.bold.green('Project Path Generator'));

    let resources = this.getResources().paths;
    let pathPrompts = resources.prompts.map(pathObj => {
      pathObj.message = chalk.cyan(pathObj.heading) + pathObj.message;
      pathObj.default = _.get(defaultPaths, pathObj.name);
      pathObj.validate = validatePath;
      pathObj.when = (answers) => !answers.useDefaults;

      return pathObj;
    });


    let done = this.async();

    let prompts = [
      {
        type: 'confirm',
        name: 'useDefaults',
        message: 'Use default/existing paths?',
        default: true
      }
    ].concat(pathPrompts);


    this.prompt(prompts, function (props) {
      if (props.useDefaults === true) {
        this.useDefaults = true;
        this.answers = this.generateObjFromAnswers(defaultPaths);
      } else {
        delete props.useDefaults;   // We don't want to store this in our config
        this.answers = this.generateObjFromAnswers(props);
      }

      done();
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    let config = this.answers || this.getConfig();

    // Apply the filters to the pathPrompts and the generated paths
    let pathPrompts = this.getResources().paths.prompts;

    pathPrompts.forEach((pathObj) => {
      _.set(config, pathObj.name, filterPath.call(this, _.get(config, pathObj.name), pathObj.name));
    });

    // Generate this variable to maintain compatibility with existing build-code
    config.input.modulesDir = config.input.srcDir + config.input.modulesSubDir;
    config.config.tempDir = filterPath.call(this, defaultPaths.config.tempDir, 'config.tempDir');

    // Only if we prompted for answers should we re-call the build tool
    if (this.answers) {
      this.buildTool.configure.apply(this);
    }

    this.setConfig(config);
  },


  writing: function () {
    let resources = this.getResources().paths;
    this.writeGeneratorConfig(resources);

    // Defer the actual writing to the build-tool-choice the user has made
    this.buildTool.write.apply(this);
  }
});


/**
 * A path is valid if it's trimmed value is non-blank and does not start with . and is not absolute
 * @param path
 */
function validatePath(pathStr) {
  if (!(typeof pathStr === 'string' && _.trim(pathStr))) {
    return 'Path must not be blank';
  }
  if (pathStr.startsWith('.' + path.sep)) {
    return 'Path must not start with ".' + path.sep + '"';
  }
  if (pathStr.indexOf('..' + path.sep) !== -1) {
    return 'Path must not contain "..' + path.sep + '"';
  }

  if (path.isAbsolute(pathStr)) {
    return 'Absolute paths are not permitted';
  }

  return true;
}

/**
 * Modify the path to make sure it is valid
 *
 * @param pathStr
 * @param promptKey
 * @returns {*}
 */
function filterPath(pathStr, promptKey) {
  let newPath = pathStr;
  if (typeof pathStr !== 'string') {
    newPath = '';
  }

  if (path.isAbsolute(pathStr)) {
    return this.env.error('"paths.' + promptKey + '" cannot be an absolute path: ' + pathStr);
  }

  if (pathStr.indexOf('..' + path.sep) !== -1) {
    this.env.error('"paths.' + promptKey + '" cannot contain "..' + path.sep + '"');
  }

  newPath = _.trim(newPath);
  if (!newPath) {
    // Only the input.modulesSubDir may be blank, otherwise use the default value
    return promptKey === 'input.modulesSubDir' ? newPath : _.get(defaultPaths, promptKey);
  }

  // remove the ./ at the start
  if (newPath.startsWith('.' + path.sep)) {
    newPath = newPath.substr(2);
  }

  // Replace any path separators with the standard ones
  return path.normalize(newPath + path.sep);
}
