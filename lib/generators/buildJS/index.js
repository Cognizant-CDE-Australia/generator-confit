'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const chalk = require('chalk');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');


let frameworkScriptMap;
let frameworkNames;       // The names of the frameworks ['frameworkName', ...]
let frameworkScriptObjs;  // The framework script packages {ModuleName: 'version'}
let frameworkScripts;     // The framework script names ['ModuleName', ...]

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;

      frameworkScriptMap = this.getResources().buildJS.frameworks;
      frameworkNames = _.keys(frameworkScriptMap);

      frameworkScriptObjs = _.flatten(_.flatten(_.values(frameworkScriptMap)).map((obj) => {
        return obj.packages.map(pkg => {
          var newObj = {};
          newObj[pkg.name] = pkg.version;
          return newObj;
        });
      }));
      frameworkScripts = frameworkScriptObjs.map((pkg) => _.keys(pkg)[0]);
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build JS Generator'));

    let done = this.async();
    let self = this;
    let res = this.getResources().buildJS;

    let prompts = [
      {
        type: 'list',
        name: 'sourceFormat',
        message: 'Source code language',
        choices: _.keys(res.sourceFormat),
        default: this.getConfig('sourceFormat') || res.sourceFormatDefault
      },
      {
        type: 'list',
        name: 'outputFormat',
        message: 'Target output language',
        choices: res.outputFormat,
        default: this.getConfig('outputFormat') || res.outputFormatDefault
      },
      {
        type: 'checkbox',
        name: 'framework',
        message: 'JavaScript Framework (optional)',
        choices: frameworkNames,
        default: this.getConfig('framework') || [],
        when: () => frameworkNames.length
      },
      {
        type: 'checkbox',
        name: 'vendorScripts',
        message: 'Vendor scripts OR module-names to include ' + chalk.bold.green('(edit in ' + self.configFile + ')') + ':',
        choices: function() {
          // Get a list of the vendor scripts
          let vendorScripts = (self.getConfig('vendorScripts') || []);
          let cbItems = [];
          let index = 0;
          vendorScripts.forEach(function(script) {
            index++;
            cbItems.push({
              name: (index) + ': ' + script,
              disabled: '(read-only)',
              checked: true
            });
          });

          let headerLabel = (vendorScripts.length) ? 'Vendor Scripts' : '(No vendor scripts defined)';

          cbItems.unshift(headerLabel);   // Stick this label "bundles" onto the front of the list to allow the spacebar to be pressed without causing an exception
          return cbItems;
        },
        // Use the original answer, or generate a default one
        filter: function() {
          return self.getConfig('vendorScripts') || [];
        },
        when: () => res.showVendorScripts
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);

      done();
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    let config = this.answers || this.getConfig();
    config.framework = config.framework || [];    // We may have skipped this question, so just make sure we have an answer

    // Update the frameworkScripts answer, based on the chosen framework
    let getScriptsForFramework = (framework) => frameworkScriptMap[framework].packages.map((obj) => obj.name);

    // Add/Change the frameworkScripts property
    let activeFrameworkScripts = _.flatten(_.flatten(config.framework.map(getScriptsForFramework)));
    config.frameworkScripts = activeFrameworkScripts;

    this.buildTool.configure.apply(this);
    this.setConfig(config);
  },

  writing: function () {
    // Loop through the selected frameworks, and install the respective modules
    let frameworks = this.getConfig('framework');
    let resources = this.getResources().buildJS;

    // Add the global things
    this.writeGeneratorConfig(resources);

    // Add the framework-specific things
    (frameworks || []).forEach((framework) => {
      let frameworkResources = resources.frameworks[framework];
      this.writeGeneratorConfig(frameworkResources);
    });

    // Add the sourceFormat-specific things
    let sourceFormat = this.getConfig('sourceFormat');
    let sourceFormatResources = resources.sourceFormat[sourceFormat];
    this.writeGeneratorConfig(sourceFormatResources);

    this.buildTool.write.apply(this);
  },

  install: function () {
    // Write the typings.json file using the in-memory config data
    // This has to happen after ALL the other generators have finished writing config
    if (this.getConfig('sourceFormat') === 'TypeScript') {
      this.fs.writeJSON(this.destinationPath('typings.json'), this.ts.getTypeLibConfig());
    }

    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false
    });
  }
});
