'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');
const spdxLic = require('spdx-license-list');


// Do some one-time checks
(function updateCheck() {
  const updateNotifier = require('update-notifier');
  const pkg = require('../../../package.json');
  let options = {
    name: pkg.name,
    version: pkg.version.indexOf('semantic') > -1 ? '0.0.0' : pkg.version
  };
  let notifier = updateNotifier({pkg: options});

  notifier.notify();
})();


// Yeoman calls each object-function sequentially, from top-to-bottom. Good to know.
// This generator is a shell to call other generators and setup global config.
// It doesn't do much other work.

let hasConfig;

module.exports = confitGen.create({
  initializing: {
    init: function() {
      this.rebuildFromConfig = false;
      hasConfig = this.hasExistingConfig();
    }
  },

  prompting: {
    // By splitting this run-context into 2 sub-contexts, they are guaranteed to run in sequence
    promptForMode: function() {
      this.log(chalk.underline.bold.green('Confit App Generator'));

      if (hasConfig) {
        let done = this.async();

        let modePrompt = [
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

    promptForProjectType: function() {
      // Bail out if we just want to rebuild from the configuration file
      // AND we have a project type
      //let projectType = this.getConfig('projectType');
      if (this.rebuildFromConfig && this.projectType) {
        this.getBuildProfiles(this.projectType);
        this.updateBuildTool();
        return;
      }

      let done = this.async();
      let resources = this.getResources().app;

      let prompts = [
        {
          type: 'list',
          name: 'projectType',
          message: 'Choose the project type',
          choices: resources.projectTypeList,
          default: this.projectType || resources.defaultProjectType
        }
      ];

      this.prompt(prompts, function(answers) {
        this.projectType = answers.projectType;
        done();
      }.bind(this));
    },

    promptForEverything: function() {
      // Bail out if we just want to rebuild from the configuration file
      // But if we don't have a build tool, we need some answers!
      if (this.rebuildFromConfig && !this.buildTool.isNull) {
        return;
      }

      let done = this.async();

      // Sort out the build profiles
      let projectType = this.projectType || this.getConfig('projectType');
      let buildProfiles = this.getBuildProfiles(projectType);
      let profileDescriptions = buildProfiles.sort((a, b) => {
        return a.priority - b.priority;
      }).map(profile => {
        return {
          value: profile.name,
          name: profile.name + ' - ' + profile.description
        };
      });
      let resources = this.getResources().app;

      let popularLicenses = resources.licenses.popular;
      let defaultLicense = resources.licenses.default;
      let allLicenses = _.keys(spdxLic);
      let defaultUser = this.user.git && this.user.git.name() ? this.user.git.name() : '';

      // Ask everything...
      let prompts = [
        {
          type: 'list',
          name: 'buildProfile',
          message: 'Choose a build-profile for your project',
          choices: profileDescriptions,
          default: this.getConfig('buildProfile') || profileDescriptions[0]
        },
        {
          type: 'list',
          name: 'repositoryType',
          message: 'Where will this project be hosted?',
          default: this.getConfig('repositoryType'),
          choices: [
            'GitHub',
            'Other'
          ]
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
          default: this.getConfig().copyrightOwner || defaultUser
        }
      ];

      this.prompt(prompts, function(answers) {
        this.answers = this.generateObjFromAnswers(answers, prompts);
        // Make sure projectType is stored as an answer, even though we may have asked the question in a previous prompt
        this.answers.projectType = projectType;
        done();
      }.bind(this));
    }
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.setConfig(this.answers);

      // Update our buildTool, as it may have changed
      this.updateBuildTool();
    }

    // IMPORTANT: Reload the resources to include the project-type resources.
    this.initResources(this.projectType, true);

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
      {name: this.appPackageName}
    );

    let subGenOptions = {
      rebuildFromConfig: this.rebuildFromConfig,
      'skip-install': this.options['skip-install'],
      'skip-run': this.options['skip-run'],
      configFile: this.configFile
    };

    // Now call the other generators
    this.getResources().app.subGenerators.forEach(subGeneratorName => {
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
    // Run finalisation for all the used buildTools
    this.buildTool.finalizeAll.call(this);
  },

  install: function() {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],    //--skip-install
      skipMessage: true,
      bower: false
    });
  }
});

