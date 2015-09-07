'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var _ = require('lodash');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Entry Point Generator'));

    var self = this;
    var done = this.async();

    var prompts = [
      {
        type: 'checkbox',
        name: 'entryPoints',
        message: 'Entry-points for the application' + chalk.bold.green('(edit in confit.json)') + ':',
        choices: function() {
          var map = self.getConfig('entryPoints');
          // If there are no keys in the map, we have a blank object
          if (_.keys(map).length === 0) {
            map = {app: ['app.js']};
          }

          var cbItems = [];
          var index = 0;
          for (var key in map) {
            index++;
            cbItems.push({
              name: (index) + ': ' + key + ' <- ' + map[key].join(', '),
              disabled: '(read-only)',
              checked: true
            });
          }
          cbItems.unshift('Entry Points');   // Stick this label "bundles" onto the front of the list to allow the spacebar to be pressed without causing an exception
          return cbItems;
        }
      }
    ];


    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);
      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      if (this.answers.entryPoints.length === 0) {
        this.answers.entryPoints = {app: ['app.js']};
      }
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    this.buildTool.write(this);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true
    });
  }
});
