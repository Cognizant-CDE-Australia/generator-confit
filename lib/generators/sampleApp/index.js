'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();
    }
  },

  // We need to run this AFTER the buildJS generator and paths generator, in order to read the buildJS.sourceFormat
  // property. Hence, the 'configuring' task contains the prompts, to allow access to the buildJS config.
  configuring: {
    prompting: function() {
      // Bail out if we just want to rebuild from the configuration file
      if (this.rebuildFromConfig && this.getConfig('createSampleApp') === false) {
        return;
      }

      // Check if the build-profile's buildTool's sampleApp generator supports the selected configuration
      let buildJS = this.getGlobalConfig().buildJS;
      let sampleAppFrameworks = this.buildTool.getResources().sampleApp.js.framework;
      let selectedFramework = buildJS.framework[0] || '';
      let jsSourceFormat = buildJS.sourceFormat;

      if (!_.get(sampleAppFrameworks, [selectedFramework, 'sourceFormat', jsSourceFormat])) {
        this.log(chalk.bgRed.bold.white('A complete sample application is not available for the selected JS Framework and source code language.'));
        this.answers = {
          createSampleApp: false
        };
        return;
      }

      this.log(chalk.underline.bold.green('Sample App Generator'));

      let prompts = [
        {
          type: 'confirm',
          name: 'createSampleApp',
          message: 'Create a sample app?',
          default: this.getConfig('createSampleApp') === undefined ? true : this.getConfig('createSampleApp')
        }
      ];

      return this.prompt(prompts).then(function(props) {
        this.answers = this.generateObjFromAnswers(props);
      }.bind(this));
    },

    configuring: function() {
      // If we have new answers, then change the config
      if (this.answers) {
        // If we don't want to create a sample app, don't bother calling the buildTool.
        if (this.answers.createSampleApp) {
          this.buildTool.configure.apply(this);
        }
        this.setConfig(this.answers);
      }
    }
  },

  writing: function() {
    if (!this.getConfig('createSampleApp')) {
      return;
    }

    // Write the common generator config
    let resources = this.getResources().sampleApp;

    this.writeGeneratorConfig(resources);

    this.buildTool.write.apply(this);
  },

  install: function() {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false
    });
  }
});
