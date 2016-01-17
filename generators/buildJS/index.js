'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');


var frameworkScriptMap;
var frameworkNames;       // The names of the frameworks ['frameworkName', ...]
var frameworkScriptObjs;  // The framework script objects {name: 'version'}
var frameworkScripts;     // The framework script names ['ModuleName', ...]

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;

      frameworkScriptMap = this.getResources().js.frameworks;
      frameworkNames = _.keys(frameworkScriptMap);
      frameworkScriptObjs = _.flatten(_.values(frameworkScriptMap));
      frameworkScripts = frameworkScriptObjs.map(function(obj) {
        return _.keys(obj)[0];    // There is only one key - the script name
      });
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build JS Generator'));

    var done = this.async();
    var self = this;
    var res = this.getResources().js;

    var prompts = [
      {
        type: 'list',
        name: 'sourceFormat',
        message: 'Source code language',
        choices: res.sourceFormat.options,
        default: this.getConfig('sourceFormat') || res.sourceFormat.default
      },
      {
        type: 'list',
        name: 'outputFormat',
        message: 'Target output language',
        choices: res.outputFormat.options,
        default: this.getConfig('outputFormat') || res.outputFormat.default
      },
      //{
      //  type: 'confirm',
      //  name: 'codeSplitting',
      //  message: 'Do you wish to use code-splitting (lazy-load modules)?' + chalk.dim.green('\nNote: Code-splitting is not necessary for HTTP/2 applications.'),
      //  default: this.getConfig('codeSplitting') || false
      //},
      {
        type: 'checkbox',
        name: 'framework',
        message: 'JavaScript Framework (optional)',
        choices: frameworkNames,
        default: this.getConfig('framework') || []
      },
      {
        type: 'checkbox',
        name: 'vendorScripts',
        message: 'Vendor scripts OR module-names to include ' + chalk.bold.green('(edit in ' + self.configFile + ')') + ':',
        choices: function() {
          // Get a list of the "true" vendor scripts (not including the framework scripts)
          var vendorScripts = (self.getConfig('vendorScripts') || []).filter(function(script) {
            return frameworkScripts.indexOf(script) === -1;
          });
          var cbItems = [];
          var index = 0;
          vendorScripts.forEach(function(script) {
            index++;
            cbItems.push({
              name: (index) + ': ' + script,
              disabled: '(read-only)',
              checked: true
            });
          });

          var headerLabel = (vendorScripts.length) ? 'Vendor Scripts' : '(No vendor scripts defined)';

          cbItems.unshift(headerLabel);   // Stick this label "bundles" onto the front of the list to allow the spacebar to be pressed without causing an exception
          return cbItems;
        },
        // Use the original answer, or generate a default one
        filter: function() {
          return self.getConfig('vendorScripts') || [];
        }
      }
    ];

    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);

      done();
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      // Update the vendorScripts answer, based on the chosen framework

      // Re-add the magic answer
      var vendorScripts = this.getConfig('vendorScripts') || [];

      var oldFrameworkScripts = _.flatten(_.flatten((this.getConfig('framework') || []).map(function(framework) {
        return frameworkScriptMap[framework].map(function(obj) { return _.keys(obj); });
      })));

      // Remove the old framework scripts from vendorScripts, by only keeping the scripts which are NOT in the oldVendorScripts
      vendorScripts = vendorScripts.filter(function(script) {
        return oldFrameworkScripts.indexOf(script) === -1;
      });

      var activeFrameworkScripts = _.flatten(_.flatten(this.answers.framework.map(function(framework) {
        return frameworkScriptMap[framework].map(function(obj) { return _.keys(obj); });
      })));

      // If the new framework is "react" and the user already had a "react" vendor script, we could still get a duplicate. So call uniq().
      this.answers.vendorScripts = _.uniq(activeFrameworkScripts.concat(vendorScripts));

      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    // Loop through the selected frameworks, and install the respective modules
    var self = this;
    var frameworks = this.getConfig('framework') || [];
    var activeFrameworkScriptObjs = _.flatten(frameworks.map(function(framework) {
      return frameworkScriptMap[framework];
    }));

    // Always add dependencies - it is hard to guess correctly when to remove a framework dependency
    activeFrameworkScriptObjs.forEach(function(moduleObj) {
      self.setNpmDependencies(moduleObj);
    });

    this.buildTool.write.apply(this);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true
    });
  }
});
