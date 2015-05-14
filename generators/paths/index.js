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
    this.log(chalk.green('Project path generator'));
    this.log('Paths: rebuildFromConfig = ' + this.rebuildFromConfig);

    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'input.srcDir',
        message: 'Path to source code (relative to the current directory)',
        default: common.getConfig('input.srcDir') || 'src/'
      },
      {
        type: 'input',
        name: 'input.modulesDir',
        message: 'Path to source modules',
        default: common.getConfig('input.modulesDir') || 'src/modules/'
      },
      {
        type: 'input',
        name: 'input.assetsDir',
        message: 'Name of module assets directory',
        default: common.getConfig('input.assetsDir') || 'assets'
      },
      {
        type: 'input',
        name: 'input.includesDir',
        message: 'Name of module includes directory',
        default: common.getConfig('input.includesDir') || 'includes'
      },
      {
        type: 'input',
        name: 'input.viewsDir',
        message: 'Name of module views directory',
        default: common.getConfig('input.viewsDir') || 'views'
      },
      {
        type: 'input',
        name: 'input.stylesDir',
        message: 'Name of module styles directory',
        default: common.getConfig('input.stylesDir') || 'styles'
      },
      {
        type: 'input',
        name: 'input.templateDir',
        message: 'Name of module template directory',
        default: common.getConfig('input.templateDir') || 'template'
      },
      {
        type: 'input',
        name: 'input.unitTestDir',
        message: 'Name of module unitTest directory',
        default: common.getConfig('input.unitTestDir') || 'unitTest'
      },
      {
        type: 'input',
        name: 'input.e2eTestDir',
        message: 'Name of module e2eTest directory',
        default: common.getConfig('input.e2eTestDir') || 'e2eTest'
      },
      {
        type: 'input',
        name: 'output.devDir',
        message: 'Path to dev (relative to the current directory)',
        default: common.getConfig('output.devDir') || 'dev/'
      },
      {
        type: 'input',
        name: 'output.prodDir',
        message: 'Path to prod (relative to the current directory)',
        default: common.getConfig('output.prodDir') || 'build/static/'
      },
      {
        type: 'input',
        name: 'output.assetsSubDir',
        message: 'Path to source code (relative to the current directory)',
        default: common.getConfig('output.assetsSubDir') || 'assets/'
      },
      {
        type: 'input',
        name: 'output.cssSubDir',
        message: 'Path to CSS code (relative to the current directory)',
        default: common.getConfig('output.cssSubDir') || 'css/'
      },
      {
        type: 'input',
        name: 'output.jsSubDir',
        message: 'Path to JS code (relative to the current directory)',
        default: common.getConfig('output.jsSubDir') || 'js/'
      },
      {
        type: 'input',
        name: 'output.vendorJSSubDir',
        message: 'Path to external libraries (relative to the current directory)',
        default: common.getConfig('output.vendorJSSubDir') || 'vendor/'
      },
      {
        type: 'input',
        name: 'output.viewsSubDir',
        message: 'Path to source code (relative to the current directory)',
        default: common.getConfig('output.viewsSubDir') || 'views/'
      },
      {
        type: 'input',
        name: 'output.reportDir',
        message: 'Path to  (relative to the current directory)',
        default: common.getConfig('output.reportDir') || 'bin/'
      }
    ];


    this.prompt(prompts, function (props) {
      this.answers = common.generateObjFromAnswers(props);

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      common.setConfig(this.answers);
    }
  },


  writing: function () {
    // Defer the actual writing to the build-tool-choice the user has made (currently), this is Grunt.
    buildTool.write(this, common);
  }
});
