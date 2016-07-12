'use strict';
const _ = require('lodash');

_.mixin(require('lodash-deep'));

module.exports = {
  forEJSInObj,
  getStandardTemplateData,
  renderEJS,
  runOnEnd,
  runOnInstall
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

  function printJson(obj, numSpaces) {
    var pad = numSpaces ? '                    '.slice(-numSpaces) : '';
    return JSON.stringify(obj, null, '  ').replace(/"/g, '\\'').split('\\n').map(function(line, index) {
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
 * Recursively looks for EJS templates in the string-properties of an object
 *
 * @param {string|Object} objOrStr      Object or string
 * @param {string} templateData         Template data
 * @returns {string|Object}             Parsed object
 * @this generator
 */
function forEJSInObj(objOrStr, templateData) {
  // Render the text INSIDE ALL THE TEXT PROPERTIES of the object and replace any EJS templates with values from the data.
  return _.deepMapValues(objOrStr, value => {
    if (_.isString(value)) {
      return this.renderEJS(value, templateData);
    }
    return value;
  });
}

/**
 * Creates a new object with a copy of the "standard" template data, for use when generating files.
 *
 * @param arguments   Accepts an array of arguments to merge into a copy of the base template data (optional)
 * @this generator
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
        config: this.getGlobalConfig()      // Alias
      }
    ].concat(Array.prototype.slice.call(arguments))
  );
}


/**
 * Decorator for ejs.render() - adds additional functions: merge(), objectValues() and link()
 * @param {string} text         Text possibly containing EJS templates
 * @param {Object} template     Template data
 * @param {string} fromFile     A path from which to resolve <% include '...' %> templates, usually the source template file
 * @returns {String}            Parsed EJS string
 * @this generator
 */
function renderEJS(text, template, fromFile) {
  let options = fromFile ? {filename: fromFile} : {};
  let result = ejs.render(ejsHelperScript + text, template, options);

  // If our result contains an EJS template, process the result one more time...
  if (result.indexOf('<%') > -1) {
    result = ejs.render(ejsHelperScript + result, template, options);
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
 * @returns {*}               Undefined
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
 * @returns {*}               Undefined
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
 * @returns {*}                 Undefined
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
