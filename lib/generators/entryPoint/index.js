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

    this.log(chalk.underline.bold.green('Entry Point Generator'));

    let self = this;

    let prompts = [
      {
        type: 'checkbox',
        name: 'entryPoints',
        message: 'Entry-points for the application ' + chalk.bold.green('(edit in ' + self.configFile + ')') + ':',
        choices: function() {
          let entryPoints = self.getConfig('entryPoints') || {};
          let cbItems = [];
          let index = 0;
          let entryPointKeys = Object.keys(entryPoints);

          entryPointKeys.forEach(key => {
            index++;
            cbItems.push({
              name: index + ': ' + key + ' <- ' + entryPoints[key].join(', '),
              disabled: '(read-only)',
              checked: true
            });
          });

          let headerLabel = entryPointKeys.length ? 'Entry Points' : '(No entry points defined - generate a sample app)';

          cbItems.unshift(headerLabel);   // Stick this label "bundles" onto the front of the list to allow the spacebar to be pressed without causing an exception
          return cbItems;
        },
        // Use the original answer, or generate a default one
        filter: function() {
          return self.getConfig('entryPoints') || {};
        }
      }
    ];


    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
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
    let resources = this.getResources().entryPoint;

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
