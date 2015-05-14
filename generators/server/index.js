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

    this.hasExistingConfig = !!common.getConfig('input.serverName');
    this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;

    if (this.name) {
      this.log('Creating a server called "' + this.name + '".');
    }
  },

  prompting: function () {
    var done = this.async();
    var self = this;

    var prompts = [
      {
        type: 'input',
        name: 'serverName',
        message: 'Name of the server to generate?',
        default: 'dev',
        when: function() {
          // Only ask this question when self.name is undefined
          return self.name === undefined;
        }
      },
      {
        type: 'input',
        name: 'baseDir',
        message: 'Base directory',
        default: this.config.get('baseDir') || 'dev' // This should default to a path in the base config - which we can read from generator.config.get()
      },
      {
        type: 'input',
        name: 'basePort',
        message: 'Base port',
        default: this.config.get('basePort') || 3000
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Which protocol do you want to use?',
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
        baseDir: props.baseDir
      };

      this.log(this.answers);

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
  }
});
