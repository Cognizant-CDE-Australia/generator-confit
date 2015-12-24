'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Sample App Generator'));

    var done = this.async();

    var prompts = [
      {
        type: 'confirm',
        name: 'createScaffoldProject',
        message: 'Create a sample app?',
        default: this.getConfig('createScaffoldProject') || true
      }
    ];


    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);

      // Special case - in order to tell <entryPoint> that we are using a sample project,
      // we need to write some TEMPORARY config IN THIS STAGE, then removing the config in the writeConfig stage.

      // Write temporary config
      if (this.answers.createScaffoldProject) {
        this.answers.sampleAppEntryPoint = {
          app: ['app.js']
        };
      }
      this.setConfig(this.answers);

      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      delete this.answers.sampleAppEntryPoint;  // T
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    // Determine which sample app to create, based on the project config
    var createSampleApp = this.getConfig().createScaffoldProject;

    console.log('create sample app', createSampleApp);

    if (!createSampleApp) {
      return;
    }


    // Write the basic demo project, but maybe a tool can overwrite it?...
    var config = this.getGlobalConfig();
    var paths = config.paths;

    // Copy Assets
    var assetsTemplateDir = '../templates/assets/';
    //this.fs.copy(this.templatePath(srcTmpDir + 'index.html'), paths.input.srcDir + 'index.html');
    this.fs.copy(this.templatePath(assetsTemplateDir + '**/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.assetsDir);


    // Copy compiler-specific CSS
    var cssTemplateDir = '../templates/css/';
    var compiler = config.buildCSS.cssCompiler;
    var cssCompilerConfig = {
      css: 'app.css',
      sass: 'app.sass',
      stylus: 'app.styl'
    };
    var CSSFile = cssCompilerConfig[compiler];
    this.fs.copy(this.templatePath(cssTemplateDir + CSSFile), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + CSSFile);


    //if (buildJS.isAngular1) {
    //  gen.fs.copy(gen.toolTemplatePath('es6Angular1.x/indexAngular1.html'), paths.input.srcDir + 'index.html');
    //  gen.fs.copy(gen.toolTemplatePath('es6Angular1.x/modules/demoAngular1Module/_myApp.js'), paths.input.modulesDir + gen.demoOutputModuleDir + '_myApp.js');
    //  gen.fs.copy(gen.toolTemplatePath('es6Angular1.x/modules/demoAngular1Module/myComponent.js'), paths.input.modulesDir + gen.demoOutputModuleDir + 'myComponent.js');
    //  gen.fs.copy(gen.toolTemplatePath('es6Angular1.x/modules/demoAngular1Module/template/myComponentTemplate.html'), paths.input.modulesDir + gen.demoOutputModuleDir + paths.input.templateDir + 'myComponentTemplate.html');
    //}
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
