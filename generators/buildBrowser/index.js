'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;
    }
  },

  prompting: function() {
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build Browser Generator'));
    let done = this.async();

    let resources = this.getResources().buildBrowser;

    let browsers = resources.supportedBrowsers;
    let defaultBrowsers = resources.defaultSupportedBrowsers;
    let browserList = _.keys(browsers);
    let browserObjList = browserList.map(browser => { return { value: browser, name: browsers[browser].label};});

    let prompts = [
      {
        type: 'checkbox',
        name: 'browserSupport',
        message: 'Supported browsers (required)',
        choices: browserObjList,
        default: this.getConfig('browserSupport') || defaultBrowsers,
        validate: answer => answer.length > 0   // Must select at-least one
      }
    ];

    this.prompt(prompts, function(answers) {
      this.answers = this.generateObjFromAnswers(answers, prompts);
      done();
    }.bind(this));
  },

  configuring: function() {
    if (this.answers) {
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    let resources = this.getResources().buildBrowser;
    this.writeGeneratorConfig(resources);
    this.buildTool.write.apply(this);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false
    });
  }
});




