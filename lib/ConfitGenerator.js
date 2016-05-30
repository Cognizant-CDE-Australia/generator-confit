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

let hasGreeted = process.argv.indexOf('--no-logo') !== -1;

module.exports = {

  create: function(extraConfig) {
    if (!hasGreeted) {
      hasGreeted = confitGreet();
    }

    let confitConfig = _.merge(
      {
        initializing: {
          preInit: function() {
            // Avoid http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
            this.env.sharedFs.setMaxListeners(MAX_EVENT_LISTENERS);

            // Extend the object *instance* with the methods in common.js
            require('./common.js').apply(this);

            // Initialise the project-type specific resources
            this.projectType = this.getGlobalConfig().app.projectType;
            this.initResources(this.projectType);
          }
        }
      },
      extraConfig
    );

    return Base.extend(confitConfig);
  }
};


function confitGreet() {
  // Great the user
  let generatorVersion = require('fs-extra').readJsonSync(__dirname + '/../package.json').version;

  let welcome =
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
    chalk.white.bold('\n                                                                v' + generatorVersion) +
    '\n';

  console.log(welcome);
  return true;
}
