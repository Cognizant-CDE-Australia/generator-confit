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
        message: 'Entry-points for the application ' + chalk.bold.green('(edit in ' + self.configFile + ')') + ':',
        choices: function() {
          var map = self.getConfig('entryPoints');
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

          var headerLabel = (_.keys(map).length) ? 'Entry Points' : '(No entry points defined - generate a sample app)';

          cbItems.unshift(headerLabel);   // Stick this label "bundles" onto the front of the list to allow the spacebar to be pressed without causing an exception
          return cbItems;
        },
        // Use the original answer, or generate a default one
        filter: function() {
          if (!self.getConfig('entryPoints')) {
            return {};
          }
          return self.getConfig('entryPoints');
        }
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);
      done();
    }.bind(this));
  },

  configuring: function() {
    // If no entry point has been defined, AND we want to create a scaffold project, update the config using (temporary) data set by <sampleApp>
    var sampleAppConfig = this.getGlobalConfig().sampleApp;
    var createSampleApp = sampleAppConfig.createScaffoldProject;

    // Always use the sampleAppEntryPoint if directed to
    if (createSampleApp) {
      this.answers = {};
      this.answers.entryPoints = sampleAppConfig.sampleAppEntryPoint;
    }

    // If we have new answers, then change the config
    if (this.answers) {
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    this.buildTool.write.apply(this);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true
    });
  }
});
