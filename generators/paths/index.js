'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;
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
        srcDir: this.getConfig('input.srcDir') || 'src/',
        modulesSubDir: this.getConfig('input.modulesSubDir') || 'modules/',
        assetsDir: this.getConfig('input.assetsDir') || 'assets/',
        includesDir: this.getConfig('input.includesDir') || 'includes/',
        viewsDir: this.getConfig('input.viewsDir') || 'views/',
        stylesDir: this.getConfig('input.stylesDir') || 'styles/',
        templateDir: this.getConfig('input.templateDir') || 'template/',
        unitTestDir: this.getConfig('input.unitTestDir') || 'unitTest/',
        e2eTestDir: this.getConfig('input.e2eTestDir') || 'e2eTest/'
      },
      output: {
        devDir: this.getConfig('output.devDir') || 'dev/',
        prodDir: this.getConfig('output.prodDir') || 'prod/',
        assetsSubDir: this.getConfig('output.assetsSubDir') || 'assets/',
        cssSubDir: this.getConfig('output.cssSubDir') || 'css/',
        jsSubDir: this.getConfig('output.jsSubDir') || 'js/',
        vendorJSSubDir: this.getConfig('output.vendorJSSubDir') || 'vendor/',
        viewsSubDir: this.getConfig('output.viewsSubDir') || 'views/'
      },
      config: {
        configDir: this.getConfig('config.configDir') || 'config/',
        tempDir: this.getConfig('config.tempDir') || '.tmp/'
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
      },
      {
        type: 'input',
        name: 'config.configDir',
        message: chalk.cyan('Config path\n') + 'Path to CONFIG directory (relative to the current directory)',
        default: this.defaults.config.configDir,
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
        default: this.getConfig('output.reportDir') || 'bin/'
      }*/
    ];


    this.prompt(prompts, function (props) {
      if (props.useDefaults === true) {
        this.useDefaults = true;
        this.answers = this.generateObjFromAnswers(this.defaults);
      } else {
        delete props.useDefaults;   // We don't want to store this in our config
        this.answers = this.generateObjFromAnswers(props);
      }

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      // Generate this variable to maintain compatibility with existing build-code
      this.answers.input.modulesDir = this.answers.input.srcDir + this.answers.input.modulesSubDir;

      // Add answers for questions we will never ask... spooky!
      this.answers.config.tempDir = this.getConfig('config.tempDir') || this.defaults.config.tempDir;
      this.setConfig(this.answers);
    }
  },


  writing: function () {
    // Defer the actual writing to the build-tool-choice the user has made (currently), this is Grunt.
    this.buildTool.write(this);
  }
});
