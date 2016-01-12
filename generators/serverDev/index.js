'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var _ = require('lodash');


module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;
    }
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Dev Server Generator'));

    var server = {
      baseDir: this.getGlobalConfig().paths.output.devDir,
      port: 3000,
      hostname: 'localhost',
      protocol: 'https'
    };
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'baseDir',
        message: 'Server base directory',
        default: this.getConfig('baseDir') || server.baseDir
      },
      {
        type: 'input',
        name: 'port',
        message: 'Server port',
        default: this.getConfig('port') || server.port
      },
      {
        type: 'input',
        name: 'hostname',
        message: 'Server hostname',
        default: this.getConfig('hostname') || server.hostname
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Server protocol',
        choices: [
          'http',
          'https'
        ],
        default: this.getConfig('protocol') || server.protocol
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
