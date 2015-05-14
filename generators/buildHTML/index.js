'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log(chalk.green('Project build html generator'));

    common = require('../app/common')(this, 'buildHTML');
    buildTool = common.getBuildTool();

    //this.argument('name', {
    //  required: false,
    //  type: String,
    //  desc: 'The subgenerator name'
    //});

    this.answers = undefined;

    this.hasExistingConfig = !!common.getConfig('serverName'); //todo.. update name
    this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;

    //if (this.name) {
    //  this.log('Creating a server called "' + this.name + '".');
    //}

  },

  //prompting: function () {
  //  if (this.rebuildFromConfig) {
  //    return;
  //  }
  //
  //  var self = this;
  //  var done = this.async();
  //
  //  var prompts = [
  //    {
  //      //type: 'input',
  //      //name: 'serverName',
  //      //message: 'Server name',
  //      //default: 'dev',
  //      //when: function() {
  //      //  // Only ask this question when self.name is undefined
  //      //  return self.name === undefined;
  //      //}
  //    }
  //  ];
  //
  //  this.prompt(prompts, function (props) {
  //    this.answers = common.generateObjFromAnswers(props);
  //
  //    this.log(this.answers);
  //
  //    done();
  //  }.bind(this));
  //},

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
