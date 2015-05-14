'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var common; // Need to wait until we initialise the generator before we can use this.
var buildTool;


// Yeoman calls each object-function sequentially, from top-to-bottom. Good to know.
// This generator is a shell to call other generators. It doesn't do much other work.


module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    common = require('./common')(this, 'app');

    buildTool = common.getBuildTool();
    // Check if there is an existing config
    this.rebuildFromConfig = false;
    this.hasExistingConfig = !!common.getConfig('buildTool');
    this.log('hasExistingConfig = ' + common.getConfig('buildTool'));
  },

  promptForMode: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ultimate ' + chalk.red('Web App') + ' generator!'
    ));

    if (this.hasExistingConfig) {
      var done = this.async();

      var modePrompt = [
        {
          type: 'confirm',
          name: 'rebuildFromConfig',
          message: 'Would you like to rebuild from the existing configuration in .yo-rc.json?',
          default: true
        }
      ];

      this.prompt(modePrompt, function(props) {
        // Build site, skip to configuring
        this.rebuildFromConfig = props.rebuildFromConfig;

        done();
      }.bind(this));
    }
  },

  promptForEverything: function() {
    this.log('rebuildFromConfig = ' + this.rebuildFromConfig);

    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    var done = this.async();

    // Ask everything...
    var prompts = [
      {
        type: 'list',
        name: 'buildTool',
        message: 'Choose a build-tool to build your project',
        choices: ['grunt'],
        store: true
      }
    ];

    this.prompt(prompts, function(props) {
      this.buildTool = props.buildTool;

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // Where we save the configuration for the project
    var cfg = {
      buildTool: this.buildTool || this.config.get('buildTool')
    };
    this.config.set(cfg);
  },

  writing: function() {
    this.log('writing');

    // Common files (independent of the build-tool) to write
    this.fs.copy(
      this.templatePath('_package.json'),
      this.destinationPath('package.json')
    );
    this.fs.copy(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json')
    );

    buildTool.write(this, common);

    // Now call the other generators
    this.composeWith('ngwebapp:paths', {options: {rebuildFromConfig: this.rebuildFromConfig}});
    this.composeWith('ngwebapp:buildCSS', {options: {rebuildFromConfig: this.rebuildFromConfig}});
    this.composeWith('ngwebapp:server', {options: {rebuildFromConfig: this.rebuildFromConfig}});
  },

  install: function () {
    this.log('install');

    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
