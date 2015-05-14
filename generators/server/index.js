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
      }
    ];

    this.prompt(prompts, function (props) {
      this.serverName = props.serverName;
      this.baseDir = props.baseDir;
      done();
    }.bind(this));
  },

  writing: function () {
    console.log(JSON.stringify(buildTool));
    buildTool.write(this, common);
  }
});
