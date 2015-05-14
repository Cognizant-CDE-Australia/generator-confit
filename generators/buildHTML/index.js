'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log(chalk.green('Project build html generator'));

    common = require('../app/common')(this, 'buildHTML');
    buildTool = common.getBuildTool();

    this.answers = undefined;

    this.hasExistingConfig = !!common.getConfig('extension');
    this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;

  },

  prompting: function () {
    if (this.rebuildFromConfig) {
      return;
    }

    var done = this.async();
    var prompts = [
      {
        type: 'list',
        name: 'extension',
        message: 'HTML source files?',
        choices: [
          '.html',
          '.htm',
          '.jade',
          '.shtml'
        ],
        default: this.config.get('extension') || '.html'
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = common.generateObjFromAnswers(props);
      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      common.setConfig(this.answers);
    }
  },

  writing: function () {
    buildTool.write(this, common);
  },

  install: function () {
    this.log('install');

    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
