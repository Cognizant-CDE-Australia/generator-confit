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
  %>`;

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
 * @param arguments accepts an array of arguments to merge into a copy of the base template data (optional)
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
        buildTool: this.buildTool.getResources()
      }
    ].concat(Array.prototype.slice.call(arguments))
  );
}


/**
 * Decorator for ejs.render() - adds additional functions: merge(), objectValues() and link()
 * @param text
 * @param template
 * @param fromFile    A path from which to resolve <% include '...' %> templates, usually the source template file
 * @returns {String}
 */
function renderEJS(text, template, fromFile) {
  var options = (fromFile) ? {filename: fromFile} : {};
  return ejs.render(ejsHelperScript + text, template, options);
}


/**
 * Copy of the code in https://github.com/yeoman/generator/blob/master/lib/actions/install.js#L43
 * to run a command when the 'install' run-context is run.
 *
 * @param installer {String}  The command name, no spaces
 * @param args {Array}        (optional) An array of arguments
 * @param options {Object}    (optional) Options to pass to the spawnCommand (e.g. stdio: 'inherit')
 * @param cb {Function}       (optional) Callback function when command has completed
 */
function runOnInstall(installer, args, options, cb) {
  // Don't run things if we should skip this step
  if (this.options['skip-install']) {
    return;
  }

  cb = cb || function () {};
  options = options || {};
  args = args || [];

  this.env.runLoop.add('install', function (done) {
    this.emit(installer + ' ' + args.join(' ') + 'Install', '');
    this.spawnCommandSync(installer, args, options);
    this.emit(installer + 'Install:end', '');
    done();
  }.bind(this), { once: installer + ' ' + args.join(' '), run: false });
}


function runOnEnd(installer, args, options, cb) {
  // Don't run things if we should skip this step
  if (this.options['skip-run']) {
    return;
  }

  cb = cb || function () {};
  options = options || {};
  args = args || [];

  this.env.runLoop.add('end', function (done) {
    this.emit(installer + ' ' + args.join(' ') + 'End', '');
    this.spawnCommandSync(installer, args, options);
    this.emit(installer + 'End:end', '');
    done();
  }.bind(this), { once: installer + ' ' + args.join(' '), run: false });
}

