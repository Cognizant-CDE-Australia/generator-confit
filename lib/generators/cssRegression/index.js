'use strict';
let confitGen = require('../../core/ConfitGenerator.js');
let chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig();
    }
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Css regression tests Generator'));

    let prompts = [
      {
        type: 'confirm',
        name: 'useCssRegression',
        message: 'Setup css regression tests?',
        default: true
      }
    ];

    let done = this.async();

    this.prompt(prompts, function(props) {
      this.answers = this.generateObjFromAnswers(props);

      done();
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    let config = this.answers || this.getConfig();

    config.useCssRegression = config.useCssRegression || false;

    this.buildTool.configure.apply(this);
    this.setConfig(config);
  },

  writing: function() {
    if (!this.getConfig('useCssRegression')) {
      return;
    }

    this.writeGeneratorConfig(this);

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
