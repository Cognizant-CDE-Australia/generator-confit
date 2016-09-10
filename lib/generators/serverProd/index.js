'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');


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

    this.log(chalk.underline.bold.green('Production Server Generator'));

    let server = _.merge({}, this.getResources().serverDev.defaults, this.getConfig());

    let prompts = [
      {
        type: 'input',
        name: 'port',
        message: 'Server port',
        default: server.port
      },
      {
        type: 'input',
        name: 'hostname',
        message: 'Server hostname',
        default: server.hostname
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Server protocol',
        choices: [
          'http',
          'https'
        ],
        default: server.protocol
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
    let resources = this.getResources().serverProd;

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
