'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var _ = require('lodash');

var defaultPaths;

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

    defaultPaths = _.merge({}, this.getResources().path.defaults, this.getConfig());

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
        default: defaultPaths.input.srcDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.modulesSubDir',
        message: 'Path to MODULES directory (relative to the SOURCE directory)',
        default: defaultPaths.input.modulesSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.assetsDir',
        message: 'Name of module ASSETS directory (for images, fonts)',
        default: defaultPaths.input.assetsDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.stylesDir',
        message: 'Name of module STYLES directory (for CSS)',
        default: defaultPaths.input.stylesDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.templateDir',
        message: 'Name of module TEMPLATE directory (for component HTML templates)',
        default: defaultPaths.input.templateDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.unitTestDir',
        message: 'Name of module UNIT TEST directory',
        default: defaultPaths.input.unitTestDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'input.e2eTestDir',
        message: 'Name of module FUNCTIONAL TEST directory',
        default: defaultPaths.input.e2eTestDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.devDir',
        message: chalk.cyan('Output paths\n') + 'Path to DEV OUTPUT directory (relative to the current directory)',
        default: defaultPaths.output.devDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.prodDir',
        message: 'Path to PRODUCTION OUTPUT directory (relative to the current directory)',
        default: defaultPaths.output.prodDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.assetsSubDir',
        message: 'Path to ASSETS sub-directory (relative to the OUTPUT directory)',
        default: defaultPaths.output.assetsSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.cssSubDir',
        message: 'Path to CSS sub-directory (relative to the OUTPUT directory)',
        default: defaultPaths.output.cssSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.jsSubDir',
        message: 'Path to JS sub-directory (relative to OUTPUT directory)',
        default: defaultPaths.output.jsSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.vendorJSSubDir',
        message: 'Path to VENDOR JS libraries sub-directory (relative to OUTPUT directory)',
        default: defaultPaths.output.vendorJSSubDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'config.configDir',
        message: chalk.cyan('Config path\n') + 'Path to CONFIG directory (relative to the current directory)',
        default: defaultPaths.config.configDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      },
      {
        type: 'input',
        name: 'output.reportDir',
        message: 'Path to TEST REPORTS directory (relative to the current directory)',
        default: defaultPaths.output.reportDir,
        when: function(answers) {
          return !answers.useDefaults;
        }
      }
    ];


    this.prompt(prompts, function (props) {
      if (props.useDefaults === true) {
        this.useDefaults = true;
        this.answers = this.generateObjFromAnswers(defaultPaths);
      } else {
        delete props.useDefaults;   // We don't want to store this in our config
        this.answers = this.generateObjFromAnswers(props);
      }

      done();
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      // Generate this variable to maintain compatibility with existing build-code
      this.answers.input.modulesDir = this.answers.input.srcDir + this.answers.input.modulesSubDir;

      // Add answers for questions we will never ask... spooky!
      this.answers.config.tempDir = defaultPaths.config.tempDir;

      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },


  writing: function () {
    // Defer the actual writing to the build-tool-choice the user has made (currently), this is Grunt.
    this.buildTool.write.apply(this);
  }
});
