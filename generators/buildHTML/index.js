'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;
    }
  },

  prompting: function () {
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build HTML Generator'));

    var done = this.async();
    var prompts = [
      {
        type: 'list',
        name: 'extension',
        message: 'HTML source file extension?',
        choices: [
          '.html',
          '.htm'
        ],
        default: this.getConfig('extension') || '.html'
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);
      done();
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
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
      skipMessage: true,
      bower: false
    });
  }
});
