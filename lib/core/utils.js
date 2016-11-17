'use strict';
const _ = require('lodash');
const chalk = require('chalk');

_.mixin(require('lodash-deep'));

module.exports = {
  displayTitle,
  displayWarning,
  evalExpression,
  forEJSInObj,
  getStandardTemplateData,
  isProjectHostedOnGitHub,
  merge,
  renderEJS,
  runOnEnd,
  runOnInstall,
};


const ejs = require('ejs');
const ejsHelperScript = `<%
  // Simple object merge
  function merge(obj1, obj2) {
    var newObj = {};
    for (var key in obj1) { newObj[key] = obj1[key]; }
    for (var key in obj2) { newObj[key] = obj2[key]; }
    return newObj;
  }

  // Like _.values(), returns the list of object values. Non recursive.
  function objectValues(obj) {
    return Object.keys(obj || {}).sort().map(function (key) { return obj[key]; });
  }

  // simple link maker for Markdown - uses the url as the link text
  function link(url) {
    return '[' + url + '](' + url + ')';
  }

  function printJson(obj, numSpaces, keepDoubleQuotes) {
    var pad = numSpaces ? '                    '.slice(-numSpaces) : '';
    var str = JSON.stringify(obj, null, '  ');
    str = keepDoubleQuotes ? str : str.replace(/"/g, '\\'');
    return str.split('\\n').map(function(line, index) {
      return (index) ? pad + line : line;
    }).join('\\n');
  }

  // Right pad
  function rpad(str, maxSize) {
    str = str || '';
    while (str.length < maxSize) str += ' ';
    return str;
  }

  // Add a success message to a command
  function onSuccessCmd(msg) {
    return ' && echo \u2705 ' + msg;
  }
  %>`;


/**
 * Displays a title in the console using Chalk
 * @param {string} text  The text to display
 * @this generator
 */
function displayTitle(text) {
  this.log(chalk.underline.bold.green(text));
}


/**
 * Displays a warning message in the console using Chalk
 * @param {string} text  The warning message to display
 * @this generator
 */
function displayWarning(text) {
  this.log(chalk.bold.red(text));
}

/**
 * Evaluates an EJS expression
 *
 * @param {string|Object} ejsExprStr    String which could be undefined, '' or anything else. If it is not falsey, it will be evaluated.
 * @return {string|Object}             Evaluated expression, or undefined
 * @this generator
 */
function evalExpression(ejsExprStr) {
  if (ejsExprStr) {
    return this.renderEJS(ejsExprStr, this.getStandardTemplateData());
  }
}


/**
 * Recursively looks for EJS templates in the string-properties of an object
 *
 * @param {string|Object} objOrStr      Object or string
 * @param {string} templateData         Template data
 * @return {string|Object}             Parsed object
 * @this generator
 */
function forEJSInObj(objOrStr, templateData) {
  // Render the text INSIDE ALL THE TEXT PROPERTIES of the object and replace any EJS templates with values from the data.
  return _.deepMapValues(objOrStr, (value) => {
    if (_.isString(value)) {
      return this.renderEJS(value, templateData);
    }
    return value;
  });
}

/**
 * Creates a new object with a copy of the "standard" template data, for use when generating files.
 *
 * @param {...Object} arguments   Accepts an array of arguments to merge into a copy of the base template data (optional)
 * @this generator
 * @return {boolean}            Object containing all of the template data
 */
function getStandardTemplateData() {
  return _.merge.apply(
    this,
    [
      {},
      this.getGlobalConfig(),
      {
        pkg: this.readPackageJson(),
        configFile: this.configFile,
        resources: this.getResources(),
        buildTool: this.buildTool.getResources(),
        config: this.getGlobalConfig(),      // Alias
        globalPackages: this.getGloballyInstalledPackages(),
      },
    ].concat(Array.prototype.slice.call(arguments))     // eslint-disable-line
  );
}

/**
 * Returns a boolean to indicate if the project is hosted on GitHub
 * @this generator
 * @return {boolean}            Indicates whether this project is hosted on GitHub or not
 */
function isProjectHostedOnGitHub() {
  return this.getGlobalConfig().app.repositoryType === 'GitHub';
}


/**
 * Merges the arguments into a single object. A simple wrapper around _.merge()
 * @return {*}   The merged object, which is always merged into a blank object
 */
function merge() {
  return _.merge.apply(this, [{}].concat([].slice.call(arguments)));  // eslint-disable-line
}

/**
 * Decorator for ejs.render() - adds additional functions: merge(), objectValues() and link()
 * @param {string} text         Text possibly containing EJS templates
 * @param {Object} template     Template data
 * @param {string} fromFile     Optional - A path from which to resolve <% include '...' %> templates, usually the source template file
 * @return {String}            Parsed EJS string
 * @this generator
 */
function renderEJS(text, template, fromFile) {
  let result = '';
  try {
    let options = fromFile ? {filename: fromFile} : {};
    result = ejs.render(ejsHelperScript + text, template, options);

    // If our result contains an EJS template, process the result one more time...
    if (result.indexOf('<%') > -1) {
      result = ejs.render(ejsHelperScript + result, template, options);
    }
  } catch (e) {
    console.log(ejsHelperScript + text);
    throw(e);   // Re-throw
  }
  return result;
}


/**
 * Copy of the code in https://github.com/yeoman/generator/blob/master/lib/actions/install.js#L43
 * to run a command when the 'install' run-context is run.
 *
 * @param {String} installer  The command name, no spaces
 * @param {Array} args       (optional) An array of arguments
 * @param {Object} options    (optional) Options to pass to the spawnCommand (e.g. stdio: 'inherit')
 * @param {Function} cb       (optional) Callback function when command has completed
 * @this generator
 */
function runOnInstall(installer, args, options, cb) {
  runOnEvent.call(this, 'skip-install', 'install', 'Install', installer, args, options, cb);
}


/**
 * Copy of the code in https://github.com/yeoman/generator/blob/master/lib/actions/install.js#L43
 * to run a command when the 'install' run-context is run.
 *
 * @param {string} installer  The command name, no spaces
 * @param {Array} args       (optional) An array of arguments
 * @param {Object} options    (optional) Options to pass to the spawnCommand (e.g. stdio: 'inherit')
 * @param {Function} cb       (optional) Callback function when command has completed
 * @this generator
 */
function runOnEnd(installer, args, options, cb) {
  runOnEvent.call(this, 'skip-run', 'end', 'End', installer, args, options, cb);
}

/**
 *
 * @param {string} bailOption   If this generator option is specified, don't proceed
 * @param {string} eventName    Name of the environment to hook into
 * @param {string} eventTitle   Name of event to emit
 * @param {string} installer    The command name, no spaces
 * @param {Array} args          (optional) An array of arguments
 * @param {Object} options      (optional) Options to pass to the spawnCommand (e.g. stdio: 'inherit')
 * @param {Function} cb         (optional) Callback function when command has completed
 *
 * @this generator
 */
function runOnEvent(bailOption, eventName, eventTitle, installer, args, options, cb) {
  // Don't run things if we should skip this step
  if (this.options[bailOption]) {
    return;
  }

  cb = cb || function() {};
  options = options || {};
  args = args || [];

  this.env.runLoop.add(eventName, function(done) {
    this.emit(installer + ' ' + args.join(' ') + eventTitle, '');
    this.spawnCommandSync(installer, args, options);
    this.emit(installer + eventTitle + ':' + eventName, '');
    done();
  }.bind(this), {once: installer + ' ' + args.join(' '), run: false});
}
