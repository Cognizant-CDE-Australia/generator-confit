'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: {

    preInit: function() {
      common = require('../app/common')(this, 'buildHTML');
      buildTool = common.getBuildTool();
    },
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = common.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function () {
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Project build html generator'));

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
