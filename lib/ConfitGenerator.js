'use strict';
const Base = require('yeoman-generator').Base;
const _ = require('lodash');
const chalk = require('chalk');
const Storage = require('yeoman-generator/lib/util/storage');
const path = require('path');

const MAX_EVENT_LISTENERS = 20;

/**
 * Override the _getStorage() method to store our config in 'confit.json'
 *
 * Can also be passed via the `configFile=path/to/file` flag on CLI
 */
Base.prototype._getStorage = function () {
  this.configFile = this.options.configFile || 'confit.json';
  var storePath = path.join(this.destinationRoot(), this.configFile);
  return new Storage(this.rootGeneratorName(), this.fs, storePath);
};


// Extend the Base prototype
_.extend(Base.prototype, require('./buildToolUtils.js'));
_.extend(Base.prototype, require('./fileUtils.js'));
_.extend(Base.prototype, require('./npm.js'));
_.extend(Base.prototype, require('./markdownUtils.js'));
_.extend(Base.prototype, require('./resources.js'));
_.extend(Base.prototype, {ts: require('./TypeScriptUtils.js')});
_.extend(Base.prototype, require('./utils.js'));

//console.log(Base.prototype);
let hasGreeted = false;

module.exports = {

  create: function(extraConfig) {
    if (!hasGreeted) {
      hasGreeted = confitGreet();
    }

    var yoConfig = _.merge(
      {
        initializing: {
          preInit: function() {
            // Avoid http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
            this.env.sharedFs.setMaxListeners(MAX_EVENT_LISTENERS);

            // Extend the object *instance* with the methods in common.js
            require('./common.js').apply(this);
          }
        }
      },
      extraConfig
    );

    return Base.extend(yoConfig);
  }
};


function confitGreet() {
  // Great the user
  var welcome =
    '\n' +
    chalk.cyan.bold('\n                                                                      ') + chalk.white.bold('╓╗╗') +
    chalk.cyan.bold('\n                                                                 ') + chalk.white.bold('╗╣╣╣╣╣╣╣╗') +
    chalk.cyan.bold('\n                                                                ') + chalk.white.bold('╠╣╣╣╣╣╣╣╣╣') + chalk.yellow.bold('╣╗╗╗') +
    chalk.cyan.bold('\n                                                                ') + chalk.white.bold('╚╣╣╣╣╣╣╣╣') + chalk.yellow.bold('╣╣╣╣╝') +
    chalk.cyan.bold('\n ╓╣╣╣╣╣╣╣╗  ╔╣╣╣╣╣╣╣  ╞╣╣╣  ╣╣╣  ╣╣╣╣╣╣╣ ╣╣╣╣ ╣╣╣╣╣╣╣╣╣ ') + chalk.white.bold('╣╣╗      ╙╣╣╣╣╣╣╣╣╜') +
    chalk.cyan.bold('\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╣ ╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣   ') + chalk.white.bold('╣╣╣╣╣╣╗╗╗╗╣╣╣╣╣╣╣╣╣╣╗ ') +
    chalk.cyan.bold('\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╣╗╣╣╣  ╣╣╣╣╗╗╗ ╣╣╣╣   ╠╣╣╣   ') + chalk.white.bold('╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╕') +
    chalk.cyan.bold('\n ╣╣╣╣       ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╣╣╣╣╣  ╣╣╣╣╣╣╣ ╣╣╣╣   ╠╣╣╣   ') + chalk.white.bold('╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣') +
    chalk.cyan.bold('\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╚╣╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣   ') + chalk.white.bold('└╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╝') +
    chalk.cyan.bold('\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣ ╣╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣     ') + chalk.white.bold('╚╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╝') +
    chalk.cyan.bold('\n └╝╣╣╣╣╣╝   └╝╣╣╣╣╣╝  ╞╣╣╣ ╘╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣        ') + chalk.white.bold('╙╝╣╣╣╣╣╣╣╣╣╣╣╝╙ ') +
    '\n' +
    '\n';

  console.log(welcome);
  return true;
}
