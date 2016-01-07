'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var _ = require('lodash');
var MAX_EVENT_LISTENERS = 20;


// Yeoman calls each object-function sequentially, from top-to-bottom. Good to know.
// This generator is a shell to call other generators and setup global config.
// It doesn't do much other work.

module.exports = confitGen.create({
  initializing: {
    init: function() {
      this.rebuildFromConfig = false;
      this.hasConfig = this.hasExistingConfig();

      // Avoid http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
      this.env.sharedFs.setMaxListeners(MAX_EVENT_LISTENERS);
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
          message: 'Would you like to rebuild from the existing configuration in ' + this.configFile + '?',
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

    var self = this;
    var done = this.async();

    // Sort out the build profiles
    var buildProfiles = this.getBuildProfiles();
    var profileDescriptions = buildProfiles.map(function(profile) {
      return profile.name + ' - ' + profile.description;
    });


    // Ask everything...
    var prompts = [
      {
        type: 'list',
        name: 'buildProfile',
        message: 'Choose a build-profile for your project',
        choices: profileDescriptions,
        default: function() {
          var existingProfileName = self.getConfig('buildProfile');
          var existingProfileDesc = '';
          if (existingProfileName) {
            buildProfiles.forEach(function(profile, index) {
              if (profile.name === existingProfileName) {
                existingProfileDesc = profile.name + ' - ' + profile.description;
              }
            });
          }
          return existingProfileDesc;
        },
        filter: function(answer) {
          var profile = buildProfiles.filter(function(profile) {
            return (profile.name + ' - ' + profile.description) === answer;
          });
          return profile[0].name;
        }
      },
      {
        type: 'confirm',
        name: 'editorConfig',
        message: 'Use EditorConfig?',
        default: this.getConfig('editorConfig') || true
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
    // Re-set the buildTool property, in case it has been changed
    this.buildTool = this.getBuildTool();

    // Common files (independent of the build-tool) to write
    var packageJSON = this.destinationPath('package.json');
    if (!this.fs.exists(packageJSON)) {
      this.fs.copy(
        this.templatePath('_package.json'),
        packageJSON
      );
    }

    // TODO: Why is bower here?
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


    this.setNpmDevDependencies({'npm-run-all': '1.4.0'});

    // Build-tool specific files
    this.buildTool.write(this);

    var subGenOptions = {
      rebuildFromConfig: this.rebuildFromConfig,
      'skip-install': this.options['skip-install'],
      configFile: this.configFile
    };


    // Now call the other generators
    this.composeWith('confit:paths', {options: _.merge({}, subGenOptions)});

    this.composeWith('confit:buildAssets', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:buildCSS', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:buildJS', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:buildHTML', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:build', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:serverDev', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:serverProd', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:verify', {options: _.merge({}, subGenOptions)});

    //
    // Release
    // Doc Gen

    //
    //// This is guaranteed to be the last thing to run
    this.composeWith('confit:sampleApp', {options: _.merge({}, subGenOptions)});
    this.composeWith('confit:entryPoint', {options: _.merge({}, subGenOptions)});   // This generator reads data from the <sampleApp>, so it MUST be run afterwards
    this.composeWith('confit:zzfinish', {options: _.merge({}, subGenOptions)});
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],    //--skip-install
      skipRun: this.options['skip-run'],
      skipMessage: true,
      callback: function() {
        // Emit a new event - dependencies installed
        this.emit('dependenciesInstalled');
      }.bind(this)
    });

    // If we skip installation, we still want to begin development
    if (this.options['skip-install']) {
      this.buildTool.beginDevelopment(this);
    } else {
      // Lastly, run the 'dev' command to start everything
      // Now you can bind to the dependencies installed event
      this.on('dependenciesInstalled', function() {
        this.buildTool.beginDevelopment(this);
      });
    }
  }
});

