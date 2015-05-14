'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: {
    preInit: function() {
      common = require('../app/common')(this, 'server');
      buildTool = common.getBuildTool();
    },
    init: function() {
      this.argument('name', {
        required: false,
        type: String,
        desc: 'The sub-generator name'
      });

      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = common.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function() {
    this.log(chalk.green('Project serve generator'));
    this.log('Server: rebuildFromConfig = ' + this.rebuildFromConfig);
    if (this.name) {
      this.log('Creating a server called "' + this.name + '".');
    }

    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig && !this.name) {
      return;
    }

    var self = this;
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'serverName',
        message: 'Server name',
        default: 'dev',
        when: function() {
          // Only ask this question when self.name is undefined
          return self.name === undefined;
        }
      },
      {
        type: 'input',
        name: 'baseDir',
        message: 'Server base directory',
        default: this.config.get('baseDir') || 'src' // This should default to a path in the base config - which we can read from generator.config.get()
      },
      {
        type: 'input',
        name: 'port',
        message: 'Server port',
        default: this.config.get('port') || 3000
      },
      {
        type: 'input',
        name: 'hostname',
        message: 'Server hostname',
        default: this.config.get('hostname') || 'localhost'
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Server protocol',
        choices: [
          'http',
          'https'
        ],
        default: this.config.get('protocol') || 'https'
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
