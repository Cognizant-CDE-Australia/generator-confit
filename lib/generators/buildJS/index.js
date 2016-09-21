'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const _ = require('lodash');
const chalk = require('chalk');

let frameworkScriptMap;
let frameworkNames;       // The names of the frameworks ['frameworkName', ...]

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();

      frameworkScriptMap = this.getResources().buildJS.frameworks;
      frameworkNames = Object.keys(frameworkScriptMap);
    }
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Build JS Generator');

    let self = this;
    let resources = this.getResources().buildJS;
    let genDefaults = this.merge(resources.defaults, this.getConfig());

    let prompts = [
      {
        type: 'list',
        name: 'sourceFormat',
        message: 'Source code language',
        choices: Object.keys(resources.sourceFormat),
        default: genDefaults.sourceFormat
      },
      {
        type: 'list',
        name: 'outputFormat',
        message: 'Target output language',
        choices: resources.outputFormat,
        default: genDefaults.outputFormat
      },
      {
        type: 'checkbox',
        name: 'framework',
        message: 'JavaScript Framework (optional)',
        choices: frameworkNames,
        default: genDefaults.framework,
        when: () => frameworkNames.length
      },
      {
        type: 'checkbox',
        name: 'vendorScripts',
        message: 'Vendor scripts OR module-names to include ' + chalk.bold.green('(edit in ' + self.configFile + ')') + ':',
        choices: function() {
          // Get a list of the vendor scripts
          let vendorScripts = self.getConfig('vendorScripts') || [];
          let headerLabel = vendorScripts.length ? 'Vendor Scripts' : '(No vendor scripts defined)';
          let cbItems = [];
          let index = 0;

          vendorScripts.forEach(script => {
            index++;
            cbItems.push({
              name: index + ': ' + script,
              disabled: '(read-only)',
              checked: true
            });
          });

          cbItems.unshift(headerLabel);   // Stick this label "bundles" onto the front of the list to allow the spacebar to be pressed without causing an exception
          return cbItems;
        },
        // Use the original answer, or generate a default one
        filter: () => self.getConfig('vendorScripts') || [],
        when: () => resources.showVendorScripts
      }
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    let config = this.answers || this.getConfig();

    config.framework = config.framework || [];    // We may have skipped this question, so just make sure we have an answer

    // Update the frameworkScripts answer, based on the chosen framework
    let getScriptsForFramework = framework => frameworkScriptMap[framework].packages.map(obj => obj.name);

    // Add/Change the frameworkScripts property
    config.frameworkScripts = _.flatten(_.flatten(config.framework.map(getScriptsForFramework)));

    this.buildTool.configure.apply(this);
    this.setConfig(config);
  },

  writing: function() {
    let resources = this.getResources().buildJS;

    // Add the global things
    this.writeGeneratorConfig(resources);

    this.buildTool.write.apply(this);
  },

  install: function() {
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
