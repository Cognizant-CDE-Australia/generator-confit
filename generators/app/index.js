'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

// Yeoman calls each object-function sequentially, from top-to-bottom. Good to know.
// This generator is a shell to call other generators and setup global config.
// It doesn't do much other work.

module.exports = confitGen.create({
  initializing: {
    init: function() {
      this.rebuildFromConfig = false;
      this.hasConfig = this.hasExistingConfig();
    }
  },

  promptForMode: function() {
    // Great the user
    var welcome =
      "\n" +
      chalk.cyan.bold("\n                                                                      ") + chalk.white.bold("╓╗╗") +
      chalk.cyan.bold("\n                                                                 ")+ chalk.white.bold("╗╣╣╣╣╣╣╣╗") +
      chalk.cyan.bold("\n                                                                ")+ chalk.white.bold("╠╣╣╣╣╣╣╣╣╣") + chalk.yellow.bold("╣╗╗╗") +
      chalk.cyan.bold("\n                                                                ")+ chalk.white.bold("╚╣╣╣╣╣╣╣╣") + chalk.yellow.bold("╣╣╣╣╝") +
      chalk.cyan.bold("\n ╓╣╣╣╣╣╣╣╗  ╔╣╣╣╣╣╣╣  ╞╣╣╣  ╣╣╣  ╣╣╣╣╣╣╣ ╣╣╣╣ ╣╣╣╣╣╣╣╣╣ ")+ chalk.white.bold("╣╣╗      ╙╣╣╣╣╣╣╣╣╜") +
      chalk.cyan.bold("\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╣ ╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣   ") + chalk.white.bold("╣╣╣╣╣╣╗╗╗╗╣╣╣╣╣╣╣╣╣╣╗ ") +
      chalk.cyan.bold("\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╣╗╣╣╣  ╣╣╣╣╗╗╗ ╣╣╣╣   ╠╣╣╣   ") + chalk.white.bold("╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╕") +
      chalk.cyan.bold("\n ╣╣╣╣       ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╣╣╣╣╣  ╣╣╣╣╣╣╣ ╣╣╣╣   ╠╣╣╣   ") + chalk.white.bold("╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣") +
      chalk.cyan.bold("\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣╚╣╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣   ") + chalk.white.bold("└╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╝") +
      chalk.cyan.bold("\n ╣╣╣╣ ╠╣╣╣  ╣╣╣╣ ╣╣╣╣ ╞╣╣╣ ╣╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣     ") + chalk.white.bold("╚╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╣╝") +
      chalk.cyan.bold("\n └╝╣╣╣╣╣╝   └╝╣╣╣╣╣╝  ╞╣╣╣ ╘╣╣╣  ╣╣╣╣    ╣╣╣╣   ╠╣╣╣        ") + chalk.white.bold("╙╝╣╣╣╣╣╣╣╣╣╣╣╝╙ ") +
      "\n" +
      "\n";

    this.log(welcome);
    this.log(chalk.underline.bold.green('Confit App Generator'));

    if (this.hasConfig) {
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
    //this.log('rebuildFromConfig = ' + this.rebuildFromConfig);

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
        message: 'Choose a build-tool for your project',
        choices: ['grunt', 'webPack'],
        store: true     // Use this as the default value next time
      },
      {
        type: 'confirm',
        name: 'editorConfig',
        message: 'Use EditorConfig?',
        default: this.getConfig('editorConfig') || true
      },
      {
        type: 'confirm',
        name: 'createScaffoldProject',
        message: 'Create sample project?',
        default: this.getConfig('createScaffoldProject') || true
      }
    ];

    this.prompt(prompts, function(props) {
      this.answers = this.generateObjFromAnswers(props);

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.setConfig(this.answers);
    }
  },

  reporting: function() {
    var config = this.getGlobalConfig();

    var templates = {
      data: JSON.stringify(config)
    };

    this.fs.copyTpl(
      this.templatePath('_report.html'),
      this.destinationPath(config.paths.input.srcDir + 'confitReport.html'),
      templates
    );
  },

  writing: function() {
    // Common files (independent of the build-tool) to write
    var packageJSON = this.destinationPath('package.json');
    if (!this.fs.exists(packageJSON)) {
      this.fs.copy(
        this.templatePath('_package.json'),
        packageJSON
      );
    }

    var bowerJSON = this.destinationPath('bower.json');
    if (!this.fs.exists(bowerJSON)) {
      this.fs.copy(
        this.templatePath('_bower.json'),
        bowerJSON
      );
    }

    if (this.getConfig('editorConfig')) {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    }

    // Build-tool specific files
    this.buildTool.write(this);

    // Now call the other generators
    this.composeWith('confit:paths', {options: {rebuildFromConfig: this.rebuildFromConfig}});

    this.composeWith('confit:buildCSS', {options: {rebuildFromConfig: this.rebuildFromConfig}});
    this.composeWith('confit:buildJS', {options: {rebuildFromConfig: this.rebuildFromConfig}});
    this.composeWith('confit:buildHTML', {options: {rebuildFromConfig: this.rebuildFromConfig}});
    this.composeWith('confit:build', {options: {rebuildFromConfig: this.rebuildFromConfig}});

    this.composeWith('confit:verify', {options: {rebuildFromConfig: this.rebuildFromConfig}});

    // Create two *special* servers - dev & prod
    this.composeWith('confit:server', {options: {rebuildFromConfig: this.rebuildFromConfig, specialServer: 'DEV'}});
    this.composeWith('confit:server', {options: {rebuildFromConfig: this.rebuildFromConfig, specialServer: 'PROD'}});
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      callback: function() {
        // Emit a new event - dependencies installed
        this.emit('dependenciesInstalled');
      }.bind(this)
    });

    // Lastly, run the 'dev' command to start everything
    // Now you can bind to the dependencies installed event
    this.on('dependenciesInstalled', function() {
      this.buildTool.beginDevelopment(this);
    });

  }
});
