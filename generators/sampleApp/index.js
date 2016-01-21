'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
      this.demoOutputModuleDir = this.getResources().sampleApp.demoModuleDir;
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig && this.getConfig('createSampleApp') === false) {
      return;
    }

    this.log(chalk.underline.bold.green('Sample App Generator'));

    var done = this.async();

    var prompts = [
      {
        type: 'confirm',
        name: 'createSampleApp',
        message: 'Create a sample app?',
        default: this.getConfig('createSampleApp') || true
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
      // If we don't want to create a sample app, don't bother calling the buildTool.
      if (this.answers.createSampleApp) {
        this.buildTool.configure.apply(this);
      }
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    if (!this.getConfig('createSampleApp')) {
      return;
    }

    // Write the basic demo project, but maybe a tool can overwrite it?...
    var config = this.getGlobalConfig();
    var paths = config.paths;

    // Copy Assets
    var assetsTemplateDir = '../templates/assets/';
    this.fs.copy(this.templatePath(assetsTemplateDir + '**/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.assetsDir);


    // Copy compiler-specific CSS
    var cssTemplateDir = '../templates/css/';
    var compiler = config.buildCSS.cssCompiler;
    var cssConfig = this.getResources().css;

    // Make CSSFile a member property so that the build tool can use it too
    this.CSSFile = cssConfig[compiler].sampleAppFilename;
    this.fs.copy(this.templatePath(cssTemplateDir + this.CSSFile), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + this.CSSFile);
    this.fs.copy(this.templatePath(cssTemplateDir + 'iconFont.css'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + 'iconFont.css');


    // Defer copying of JS & HTML files to the build tool, as there WILL be build-tool-specific AND framework-specific files to use

    // Copy unit test(s)
    this.fs.copy(this.templatePath('unitTest/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.unitTestDir);

    // Copy browser test(s)
    this.fs.copy(this.templatePath('browserTest/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.browserTestDir);

    this.buildTool.write.apply(this);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false
    });
  }
});
