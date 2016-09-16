'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();
    }
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build CSS Generator'));

    let resources = this.getResources().buildCSS;

    let prompts = [
      {
        type: 'list',
        name: 'sourceFormat',
        message: 'CSS source format',
        choices: Object.keys(resources.sourceFormat),
        default: this.getConfig('sourceFormat') || resources.defaultSourceFormat
      },
      {
        type: 'confirm',
        name: 'useCssRegression',
        message: 'Setup css regression tests?',
        default: true
      }
    ];


    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
    }.bind(this));
  },

  configuring: function() {
    if (this.answers) {
      // Add an answer for a question we will never ask... spooky! Default to true
      this.answers.autoprefixer = !(this.getConfig('autoprefixer') === false);
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function() {
    let resources = this.getResources().buildCSS;

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
