'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log(chalk.green('Project path generator'));
    common = require('../app/common')(this, 'paths');
    buildTool = common.getBuildTool();
    this.answers = undefined; // Don't initialise this to an object, in case we rebuild from config

    // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
    this.hasExistingConfig = !!common.getConfig('input.srcDir');
    this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;

    this.log('Paths: rebuildFromConfig = ' + this.rebuildFromConfig);
  },

  prompting: function () {
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
      }
    ];


    this.prompt(prompts, function (props) {
      this.answers = common.generateObjFromAnswers(props);

      this.log(this.answers);

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
