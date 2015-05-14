'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log(chalk.green('Project serve generator'));

    common = require('../app/common')(this, 'server');
    buildTool = common.getBuildTool();

    this.argument('name', {
      required: false,
      type: String,
      desc: 'The subgenerator name'
    });

    this.answers = undefined;

    this.hasExistingConfig = !!common.getConfig('serverName');
    this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;

    if (this.name) {
      this.log('Creating a server called "' + this.name + '".');
    }
  },

  prompting: function () {
    if (this.rebuildFromConfig) {
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
        message: 'Protocol',
        choices: [
          'http',
          'https'
        ],
        default: this.config.get('protocol') || 'https'
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = {
        serverName: props.serverName,
        baseDir: props.baseDir,
        port: props.port,
        hostname: props.hostname,
        protocol: props.protocol
      };

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
