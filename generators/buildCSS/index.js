'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

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

    this.log(chalk.underline.bold.green('Build CSS Generator'));

    var done = this.async();
    var cssCompilerConfig = this.getResources().css;

    var prompts = [
      {
        type: 'confirm',
        name: 'includeOlderBrowsers',
        message: 'Supports older browsers (i.e. less than IE10)?',
        default: false
      },
      {
        type: 'list',
        name: 'olderBrowsers',
        message: 'Older browsers',
        choices: [
          'IE10',
          'IE9'
        ],
        default: this.getConfig('olderBrowsers') || 'IE9',
        when: function(answers) {
          return answers.includeOlderBrowsers;
        }
      },
      {
        type: 'list',
        name: 'cssCompiler',
        message: 'Choose a CSS compiler',
        choices: Object.keys(cssCompilerConfig),
        default: this.getConfig('cssCompiler') || 'stylus'
      }
    ];


    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);
      done();
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
