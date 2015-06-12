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

      // Data
      this.jsLintConfig = {
        eslint: {
          src: 'eslintrc',
          dest: '{configDir}jslint/.eslintrc'
        },
        jshint: {
          src: 'jshintrc',
          dest: '{configDir}jslint/.jshintrc'
        },
        jscs: {
          src: 'jscsrc',
          dest: '{configDir}jslint/.jscsrc'
        }
      };

    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Verify Generator'));

    var done = this.async();

    var prompts = [
      {
        type: 'checkbox',
        name: 'jsLinter',
        message: 'JavaScript linting',
        default: this.getConfig('jsLinter') || 'jshint',
        choices: Object.keys(this.jsLintConfig)
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

      // Write the jsLintConfig object to the config, if it doesn't already exist.
      // This allows a user to customise the config file location, somewhat
      this.answers.jsLintConfig = this.getConfig('jsLintConfig') || this.jsLintConfig;

      // Parse the jsLintConfig and replace references to {configDir} with the actual value.
      // Note that this replacement will normally only occur once. So if the configDir is changed,
      // you would need to change the verify section in "confit.json" as well... :(
      var linters = this.answers.jsLintConfig;
      this.log(linters);
      var configDir = this.getGlobalConfig().paths.config.configDir;
      for (var linter in linters) {
        linters[linter].dest = linters[linter].dest.replace('{configDir}', configDir);
      }

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
