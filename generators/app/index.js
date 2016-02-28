'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');
const MAX_EVENT_LISTENERS = 20;


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

  prompting: {
    // By splitting this run-context into 2 sub-contexts, they are guaranteed to run in sequence
    promptForMode: function() {
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
      // But is we don't have a build tool, we need some answers!
      if (this.rebuildFromConfig && !this.buildTool.isNull) {
        return;
      }

      var done = this.async();

      // Sort out the build profiles
      var buildProfiles = this.getBuildProfiles();
      var profileDescriptions = buildProfiles.map(profile => profile.name + ' - ' + profile.description);
      var existingProfileName = this.getConfig('buildProfile');
      var resources = this.getResources().app;
      var browsers = resources.supportedBrowsers;
      var defaultBrowsers = resources.defaultSupportedBrowsers;

      var browserList = _.keys(browsers);
      var browserObjList = browserList.map(browser => { return { value: browser, name: browsers[browser].label};});

      // Ask everything...
      var prompts = [
        {
          type: 'list',
          name: 'buildProfile',
          message: 'Choose a build-profile for your project',
          choices: profileDescriptions,
          default: function() {
            var existingProfileDesc = '';

            buildProfiles.forEach(profile => {
              if (profile.name === existingProfileName) {
                existingProfileDesc = profile.name + ' - ' + profile.description;
              }
            });

            // If we still don't have a profile description (because our profile name changed, for instance), use the first one.
            if (!existingProfileDesc) {
              existingProfileDesc = profileDescriptions[0];
            }
            return existingProfileDesc;
          },
          // Convert the label back into the name:
          filter: function(answer) {
            var profile = buildProfiles.filter(profile => (profile.name + ' - ' + profile.description) === answer);
            return profile[0].name;
          }
        },
        {
          type: 'checkbox',
          name: 'browserSupport',
          message: 'Supported browsers (required)',
          choices: browserObjList,
          default: this.getConfig().browserSupport || defaultBrowsers,
          validate: answer => answer.length > 0   // Must select at-least one
        }
      ];

      this.prompt(prompts, function(props) {
        this.answers = this.generateObjFromAnswers(props);
        done();
      }.bind(this));
    }
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);

      // Update our buildtool, as it may have changed
      this.updateBuildTool();
    }
  },

  writing: function() {
    // Common files (independent of the build-tool) to write
     this.copyIfNotExist(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { name: this.appPackageName }
    );

    // Don't overwrite an existing editorConfig - that would be bad manners.
    this.copyIfNotExist(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));

    this.setNpmDevDependenciesFromArray(this.getResources().app.packages);

    // Build-tool specific files
    this.buildTool.write.apply(this);

    var subGenOptions = {
      rebuildFromConfig: this.rebuildFromConfig,
      'skip-install': this.options['skip-install'],
      'skip-run': this.options['skip-run'],
      configFile: this.configFile
    };


    // Now call the other generators
    this.getResources().app.subGenerators.forEach((subGeneratorName) => {
      this.composeWith(subGeneratorName, {options: _.merge({}, subGenOptions)});
    });
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],    //--skip-install
      skipMessage: true,
      bower: false
    });
  }
});

