'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');
const spdxLic = require('spdx-license-list');

// Yeoman calls each object-function sequentially, from top-to-bottom. Good to know.
// This generator is a shell to call other generators and setup global config.
// It doesn't do much other work.

let userName;     // Transient - do not store in confit.json

module.exports = confitGen.create({
  initializing: {
    init: function() {
      this.rebuildFromConfig = false;
      this.hasConfig = this.hasExistingConfig();
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

      let done = this.async();

      // Sort out the build profiles
      let buildProfiles = this.getBuildProfiles();
      let profileDescriptions = buildProfiles.map(profile => profile.name + ' - ' + profile.description);
      let existingProfileName = this.getConfig('buildProfile');
      let resources = this.getResources().app;

      let popularLicenses = resources.licenses.popular;
      let defaultLicense = resources.licenses.default;
      let allLicenses = _.keys(spdxLic);

      let browsers = resources.supportedBrowsers;
      let defaultBrowsers = resources.defaultSupportedBrowsers;
      let browserList = _.keys(browsers);
      let browserObjList = browserList.map(browser => { return { value: browser, name: browsers[browser].label};});


      // Ask everything...
      let prompts = [
        {
          type: 'list',
          name: 'buildProfile',
          message: 'Choose a build-profile for your project',
          choices: profileDescriptions,
          default: function() {
            let existingProfileDesc = '';

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
            let profile = buildProfiles.filter(profile => (profile.name + ' - ' + profile.description) === answer);
            return profile[0].name;
          }
        },
        {
          type: 'list',
          name: 'license',
          message: 'Choose a licence',
          default: this.getConfig().license || defaultLicense,
          choices: [].concat(new inquirer.Separator('---- Popular (below) ----'), popularLicenses, new inquirer.Separator('---- Popular (above) ----'), allLicenses)
        },
        {
          type: 'input',
          name: 'copyrightOwner',
          message: 'Copyright owner',
          default: this.getConfig().copyrightOwner || this.user.git.name()
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

      this.prompt(prompts, function(answers) {
        // Remove the username from the answers, as we only want it temporarily
        this.answers = this.generateObjFromAnswers(answers, prompts);
        done();
      }.bind(this));
    }
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);

      // Update our buildTool, as it may have changed
      this.updateBuildTool();
    }

    // Make sure that even older configurations receive a license property, even when rebuilding
    let existingConfig = this.getConfig();
    if (!existingConfig.license) {
      existingConfig.license = this.getResources().app.licenses.default;
      this.setConfig(existingConfig);
    }

    // Common files (independent of the build-tool) to write
    this.copyIfNotExist(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { name: this.appPackageName }
    );

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

  writing: function() {
    let resources = this.getResources().app;
    let config = this.getConfig();
    this.writeGeneratorConfig(resources);

    // Write the license file if there is one
    if (config.license && resources.licenses.noLicenseFile.indexOf(config.license) === -1) {
      let licenseObj = require('spdx-license-list/spdx-full')[config.license];
      let licenseText = licenseObj.license;
      let templateData = {
        licenseText,
        copyrightOwner: config.copyrightOwner,
        projectName: '' + this.readPackageJson().name
      };

      this.copyGeneratorTemplates(resources.licenses.templateFiles, templateData);
      if (licenseText.indexOf('<') > -1) {
        this.log(chalk.bold.red('The license file MAY contain templates. Please review before committing.'));
      }
    }

    this.buildTool.write.apply(this);

    // Run finalisation for all the used buildTools
    this.buildTool.finalizeAll.call(this);
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

