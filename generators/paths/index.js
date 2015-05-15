'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: {
    preInit: function() {
      common = require('../app/common')(this, 'paths');
      buildTool = common.getBuildTool();
    },
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = common.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig || this.useDefaults) {
      return;
    }

    this.log(chalk.underline.bold.green('Project Path Generator'));

    // Defaults object
    this.defaults = {
      input: {
        srcDir: common.getConfig('input.srcDir') || 'src/',
        modulesSubDir: common.getConfig('input.modulesSubDir') || 'modules/',
        assetsDir: common.getConfig('input.assetsDir') || 'assets',
        includesDir: common.getConfig('input.includesDir') || 'includes',
        viewsDir: common.getConfig('input.viewsDir') || 'views',
        stylesDir: common.getConfig('input.stylesDir') || 'styles',
        templateDir: common.getConfig('input.templateDir') || 'template',
        unitTestDir: common.getConfig('input.unitTestDir') || 'unitTest',
        e2eTestDir: common.getConfig('input.e2eTestDir') || 'e2eTest'
      },
      output: {
        devDir: common.getConfig('output.devDir') || 'dev/',
        prodDir: common.getConfig('output.prodDir') || 'prod',
        assetsSubDir: common.getConfig('output.assetsSubDir') || 'assets/',
        cssSubDir: common.getConfig('output.cssSubDir') || 'css/',
        jsSubDir: common.getConfig('output.jsSubDir') || 'js/',
        vendorJSSubDir: common.getConfig('output.vendorJSSubDir') || 'vendor/',
        viewsSubDir: common.getConfig('output.viewsSubDir') || 'views/'
      }
    };


    var done = this.async();

    var prompts = [
      {
        type: 'confirm',
        name: 'useDefaults',
        message: 'Use default/existing paths?',
        default: true
      },
      {
        type: 'input',
        name: 'input.srcDir',
        message: chalk.cyan('Source-code paths\n') + 'Path to SOURCE directory (relative to the current directory)',
        default: this.defaults.input.srcDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.modulesSubDir',
        message: 'Path to MODULES directory (relative to the SOURCE directory)',
        default: this.defaults.input.modulesSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.assetsDir',
        message: 'Name of module ASSETS directory (for images, fonts)',
        default: this.defaults.input.assetsDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.includesDir',
        message: 'Name of module INCLUDES directory (for compile-time including of files)',
        default: this.defaults.input.includesDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.viewsDir',
        message: 'Name of module VIEWS directory (for HTML fragments)',
        default: this.defaults.input.viewsDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.stylesDir',
        message: 'Name of module STYLES directory (for CSS)',
        default: this.defaults.input.stylesDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.templateDir',
        message: 'Name of module TEMPLATE directory (for component HTML templates)',
        default: this.defaults.input.templateDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.unitTestDir',
        message: 'Name of module UNIT TEST directory',
        default: this.defaults.input.unitTestDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.e2eTestDir',
        message: 'Name of module FUNCTIONAL TEST directory',
        default: this.defaults.input.e2eTestDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.devDir',
        message: chalk.cyan('Output paths\n') + 'Path to DEV OUTPUT directory (relative to the current directory)',
        default: this.defaults.output.devDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.prodDir',
        message: 'Path to PRODUCTION OUTPUT directory (relative to the current directory)',
        default: this.defaults.output.prodDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.assetsSubDir',
        message: 'Path to ASSETS sub-directory (relative to the OUTPUT directory)',
        default: this.defaults.output.assetsSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.cssSubDir',
        message: 'Path to CSS sub-directory (relative to the OUTPUT directory)',
        default: this.defaults.output.cssSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.jsSubDir',
        message: 'Path to JS sub-directory (relative to OUTPUT directory)',
        default: this.defaults.output.jsSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.vendorJSSubDir',
        message: 'Path to VENDOR JS libraries sub-directory (relative to OUTPUT directory)',
        default: this.defaults.output.vendorJSSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.viewsSubDir',
        message: 'Path to VIEWS sub-directory (relative to OUTPUT directory)',
        default: this.defaults.output.viewsSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      }/*

      // We will ask for the reporting directory in the test-generator
      ,
      {
        type: 'input',
        name: 'output.reportDir',
        message: 'Path to  (relative to the current directory)',
        default: common.getConfig('output.reportDir') || 'bin/'
      }*/
    ];


    this.prompt(prompts, function (props) {
      if (props.useDefaults === true) {
        this.useDefaults = true;
        this.answers = common.generateObjFromAnswers(this.defaults);
      } else {
        delete props.useDefaults;   // We don't want to store this in our config
        this.answers = common.generateObjFromAnswers(props);
      }

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      // Generate this variable to maintain compatibility with existing build-code
      this.answers.input.modulesDir = this.answers.input.srcDir + this.answers.input.modulesSubDir;

      common.setConfig(this.answers);
    }
  },


  writing: function () {
    // Defer the actual writing to the build-tool-choice the user has made (currently), this is Grunt.
    buildTool.write(this, common);

    //
  }
});
