'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const inquirer = require('inquirer');
const spdxLic = require('spdx-license-list');


// Do some one-time checks to see if Confit needs to be updated
(function updateCheck() {
  const updateNotifier = require('update-notifier');
  const pkg = require('../../../package.json');
  let options = {
    name: pkg.name,
    version: pkg.version.indexOf('semantic') > -1 ? '0.0.0' : pkg.version,
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
    },
  },

  prompting: {
    // By splitting this run-context into 2 sub-contexts, they are guaranteed to run in sequence
    promptForMode: function() {
      this.displayTitle('Confit App Generator');

      if (hasConfig) {
        let modePrompt = [
          {
            type: 'confirm',
            name: 'rebuildFromConfig',
            message: 'Would you like to rebuild from the existing configuration in ' + this.configFile + '?',
            default: true,
          },
        ];

        return this.prompt(modePrompt).then(function(props) {
          // Build site, skip to configuring
          this.rebuildFromConfig = props.rebuildFromConfig;
        }.bind(this));
      }
    },

    promptForProjectType: function() {
      // Bail out if we just want to rebuild from the configuration file
      // AND we have a project type

      if (this.rebuildFromConfig && this.projectType) {
        this.getBuildProfiles(this.projectType);
        this.updateBuildTool();
        return;
      }

      let resources = this.getResources().app;
      let prompts = [
        {
          type: 'list',
          name: 'projectType',
          message: 'Choose the project type',
          choices: resources.projectTypeList,
          default: this.projectType || resources.defaults.projectType,
        },
      ];

      return this.prompt(prompts).then(function(answers) {
        this.projectType = answers.projectType;
      }.bind(this));
    },

    promptForEverything: function() {
      // Bail out if we just want to rebuild from the configuration file
      // But if we don't have a build tool, we need some answers!
      if (this.rebuildFromConfig && !this.buildTool.isNull) {
        return;
      }

      // Sort out the build profiles
      let projectType = this.projectType || this.getConfig('projectType');
      let buildProfiles = this.getBuildProfiles(projectType);
      let profileDescriptions = buildProfiles.sort((a, b) => {
        return a.priority - b.priority;
      }).map((profile) => {
        return {
          value: profile.name,
          name: profile.name + ' - ' + profile.description,
        };
      });
      let resources = this.getResources().app;
      let genDefaults = this.merge(resources.defaults, this.getConfig());

      let popularLicenses = resources.licenses.popular;
      let allLicenses = Object.keys(spdxLic);
      let defaultUser = this.user.git && this.user.git.name() ? this.user.git.name() : '';

      // Ask everything...
      let prompts = [
        {
          type: 'list',
          name: 'buildProfile',
          message: 'Choose a build-profile for your project',
          choices: profileDescriptions,
          default: genDefaults.buildProfile || profileDescriptions[0],
        },
        {
          type: 'list',
          name: 'repositoryType',
          message: 'Where will this project be hosted?',
          default: genDefaults.repositoryType,
          choices: resources.repositoryTypes,
        },
        {
          type: 'confirm',
          name: 'publicRepository',
          message: 'Is this repository public (viewable by everyone)?',
          default: genDefaults.publicRepository,
        },
        {
          type: 'list',
          name: 'license',
          message: 'Choose a licence',
          default: genDefaults.license,
          choices: [].concat(new inquirer.Separator('---- Popular (below) ----'), popularLicenses, new inquirer.Separator('---- Popular (above) ----'), allLicenses),
        },
        {
          type: 'input',
          name: 'copyrightOwner',
          message: 'Copyright owner',
          default: genDefaults.copyrightOwner || defaultUser,
        },
      ];

      return this.prompt(prompts).then(function(answers) {
        this.answers = this.generateObjFromAnswers(answers, prompts);
        // Make sure projectType is stored as an answer, even though we may have asked the question in a previous prompt
        this.answers.projectType = projectType;
      }.bind(this));
    },
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
      existingConfig.license = this.getResources().app.defaults.license;
      this.setConfig(existingConfig);
    }

    // Common files (independent of the build-tool) to write
    this.copyIfNotExist(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {name: this.appPackageName}
    );

    let subGenOptions = {
      'rebuildFromConfig': this.rebuildFromConfig,
      'skip-install': this.options['skip-install'],
      'skip-run': this.options['skip-run'],
      'configFile': this.configFile,
    };

    // Now call the other generators
    this.getResources().app.subGenerators.forEach((subGeneratorName) => {
      this.composeWith(subGeneratorName, {options: this.merge(subGenOptions)});
    });
  },

  writing: function() {
    let resources = this.getResources().app;
    let config = this.getConfig();

    this.writeGeneratorConfig(resources);

    // Write the license file if there is one
    if (config.license && resources.licenses.noLicenseFile.indexOf(config.license) === -1) {
      let licenseObj = require('spdx-license-list/spdx-full.json')[config.license];
      let licenseText = licenseObj.license;
      let templateData = {
        licenseText,
        copyrightOwner: config.copyrightOwner,
        projectName: String(this.readPackageJson().name),
      };

      this.copyGeneratorTemplates(resources.licenses.templateFiles, templateData);
      if (licenseText.indexOf('<') > -1) {
        this.displayWarning('The license file MAY contain templates. Please review before committing.');
      }
    }
    // Run finalisation for all the used buildTools
    this.buildTool.finalizeAll.call(this);
  },

  install: function() {
    // Before installing, remove any devDependencies that are also dependencies in package.json
    let pkg = this.readPackageJson();
    let newDevDepNames = Object.keys(pkg.devDependencies || {}) || [];
    let existingDepNames = Object.keys(pkg.dependencies || {}) || [];

    newDevDepNames.filter((name) => existingDepNames.indexOf(name) === -1).forEach((name) => {
      delete pkg.devDependencies[name];
    });


    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],    // --skip-install
      skipMessage: true,
      bower: false,
    });
  },
});

