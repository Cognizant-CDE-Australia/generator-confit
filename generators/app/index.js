'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');


// Yeoman calls each object-function sequentially, from top-to-bottom. Good to know.


module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    // Check if there is an existing config
    this.hasExistingConfig = !!this.config.get('taskRunner');
  },

  promptForMode: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ultimate ' + chalk.red('Web App') + ' generator!'
    ));

    if (this.hasExistingConfig) {

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
        this.rebuildFromConfig = props.rebuildFromConfig

        done();
      }.bind(this));
    }
  },

  promptForEverything: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    var done = this.async();

    // Ask everything...
    var prompts = [
      {
        type: 'list',
        name: 'taskRunner',
        message: 'Choose a task runner to build your project',
        choices: ["grunt"],
        store: true
      }
    ];

    this.prompt(prompts, function(props) {
      this.taskRunner = props.taskRunner;

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // Where we save the configuration for the project
    if (this.taskRunner) {
      this.config.set('taskRunner', this.taskRunner);
    }
  },

  writing: {
    //app: function () {
    //  this.fs.copy(
    //    this.templatePath('_package.json'),
    //    this.destinationPath('package.json')
    //  );
    //  this.fs.copy(
    //    this.templatePath('_bower.json'),
    //    this.destinationPath('bower.json')
    //  );
    //},
    //
    //projectfiles: function () {
    //  this.fs.copy(
    //    this.templatePath('editorconfig'),
    //    this.destinationPath('.editorconfig')
    //  );
    //  this.fs.copy(
    //    this.templatePath('jshintrc'),
    //    this.destinationPath('.jshintrc')
    //  );
    //}
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    //this.installDependencies({
    //  skipInstall: this.options['skip-install']
    //});
  }
});
