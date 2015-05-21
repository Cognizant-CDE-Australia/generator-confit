'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');
var vendorBowerScripts = {};

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;

      // Must only check for bower components if bower.json exists.
      var bowerJSON = this.destinationPath('bower.json');

      // Check the real file system for bower.json, not the mem-fs version.
      if (fs.existsSync(bowerJSON)) {
        // Produce this.answers.vendorScripts array from this.answers.vendorBowerJS
        // Read vendorBowerJS package name, find package.json, main prop, only grab *.js
        _.forEach(require('main-bower-files')('**/*.js'), function(script) {
          var paths = script.split('/');
          var packageName = paths[paths.indexOf('bower_components') + 1];

          vendorBowerScripts[packageName] = (vendorBowerScripts[packageName] || []).concat([script]);
        });
      }
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build JS Generator'));

    var done = this.async();
    var defaultVendorBowerScripts = this.getConfig('vendorBowerScripts') || [];

    var prompts = [
      {
        type: 'list',
        name: 'framework',
        message: 'JavaScript Framework',
        choices: [
          'none'
        ],
        default: this.getConfig('framework') || 'none'
      },
      {
        type: 'checkbox',
        name: 'vendorBowerScripts',
        message: 'Select Bower dependencies that have JS',
        default: defaultVendorBowerScripts,
        choices: function() {
          return _.map(vendorBowerScripts || [], function(scripts, packageName) {
            var packageValue = {
              name: packageName,
              scripts: scripts
            };
            return {name: packageName, value: packageValue, checked: !!defaultVendorBowerScripts[packageName]};
          });
        },
        when: function() {
          return _.keys(vendorBowerScripts).length > 0;
        }
      },
      {
        type: 'list',
        name: 'lintJS',
        message: 'JavaScript linting',
        default: this.getConfig('lintJS') || 'jshint',
        choices: [
          'none',
          'jshint',
          'eslint'
        ]
      },
      {
        type: 'input',
        name: 'lintConfig',
        message: 'JavaScript linting configuration',
        default: function(answers) {
          // Default based on previous prompt
          // Never pull it back from config as it could have changed depending
          // on the lintJS answer.
          if (answers.lintJS === 'jshint') {
            return 'jshintrc';
          }

          if (answers.lintJS === 'eslint') {
            return 'eslintrc';
          }
        },
        when: function(answers) {
          return answers.lintJS !== 'none';
        }
      }
    ];

    this.prompt(prompts, function (props) {
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

  writing: function () {
    // Defer the actual writing to the build-tool-choice the user has made (currently), this is Grunt.
    this.buildTool.write(this);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true
    });
  }
});
