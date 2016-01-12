'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var vendorBowerScripts = {};

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;

      // Must only check for bower components if bower.json exists.
      var bowerJSON = this.destinationPath('bower.json');
      var bowerDir = this.destinationPath('bower_components');

      // Check the real file system for bower.json, not the mem-fs version.
      if (fs.existsSync(bowerJSON) && fs.existsSync(bowerDir)) {
        var mainJSBowerFiles = require('main-bower-files')('**/*.js');

        mainJSBowerFiles.forEach(function(script) {
          var paths = script.split('/');
          var packageName = paths[paths.indexOf('bower_components') + 1]; // The package name is the directory AFTER bower_components
          //console.log(typeof script);
          var relativeScriptPath = path.relative(process.cwd(), script);

          vendorBowerScripts[packageName] = (vendorBowerScripts[packageName] || []).concat([relativeScriptPath]);
        });

        //// Produce this.answers.vendorScripts array from this.answers.vendorBowerJS
        //// Read vendorBowerJS package name, find package.json, main prop, only grab *.js
        //_.forEach(require('main-bower-files')('**/*.js'), function(script) {
        //  var paths = script.split('/');
        //  var packageName = paths[paths.indexOf('bower_components') + 1]; // The package name is the directory AFTER bower_components
        //
        //  vendorBowerScripts[packageName] = (vendorBowerScripts[packageName] || []).concat([script]);
        //});
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
    var self = this;

    var prompts = [
      {
        type: 'list',
        name: 'sourceFormat',
        message: 'Source code language',
        choices: [
          'ES5',
          'ES6'
        ],
        default: this.getConfig('sourceFormat') || 'ES6'
      },
      {
        type: 'list',
        name: 'outputFormat',
        message: 'Target output language',
        choices: [
          'ES3',
          'ES5',
          'ES6'
        ],
        default: this.getConfig('outputFormat') || 'ES5'
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
        choices: [
          'AngularJS 1.x',
          'AngularJS 2.x',
          'React 0.x'
        ],
        default: this.getConfig('framework') || []
      },
      {
        type: 'checkbox',
        name: 'vendorBowerScripts',
        message: 'Select Bower JS dependencies',
        default: defaultVendorBowerScripts,
        choices: function() {
          return _.map(vendorBowerScripts || [], function(scripts, packageName) {
            var packageValue = {
              name: packageName,
              scripts: scripts
            };
            return {
              name: packageName,
              value: packageValue,
              checked: _.findIndex(defaultVendorBowerScripts, packageValue) > -1
            };
          });
        },
        when: function() {
          return _.keys(vendorBowerScripts).length > 0;
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
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    // Defer the actual writing to the build-tool-choice the user has made (currently), this is Grunt.
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
