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

    this.log(chalk.underline.bold.green('Release Generator'));

    let prompts = [
      {
        type: 'confirm',
        name: 'useSemantic',
        message: 'Use semantic releasing?',
        default: this.getConfig('useSemantic') !== undefined ? this.getConfig('useSemantic') : true
      },
      {
        type: 'list',
        name: 'commitMessageFormat',
        message: 'Commit message format',
        default: this.getConfig('commitMessageFormat') || 'Conventional',
        choices: function(answers) {
          let options = ['Conventional'];

          // If not using semantic releases, you have the option of not using a commit message format
          if (!answers.useSemantic) {
            options.push('None');
          }
          return options;
        }
      }
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);

      if (this.answers.useSemantic === false) {
        this.log(chalk.bgRed.bold.white('This project must be manually configured to generate a release. (No semantic releasing tools)'));
      } else {
        this.answers.commitMessageFormat = 'Conventional';
      }
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function() {
    let resources = this.getResources().release;

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
