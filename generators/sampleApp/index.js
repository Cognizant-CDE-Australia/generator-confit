'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
      this.demoOutputModuleDir = 'demoModule/';
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig && this.getConfig('createScaffoldProject') === false) {
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
      done();
    }.bind(this));
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      createEntryPointSampleAppConfig.apply(this);
      this.buildTool.writeConfig.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    removeEntryPointSampleAppConfig.apply(this);

    // Determine which sample app to create, based on the project config
    var createSampleApp = this.getConfig().createScaffoldProject;

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

    // Make CSSFile a member property so that the build tool can use it too
    this.CSSFile = cssCompilerConfig[compiler];
    this.fs.copy(this.templatePath(cssTemplateDir + this.CSSFile), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + this.CSSFile);
    this.fs.copy(this.templatePath(cssTemplateDir + 'iconFont.css'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + 'iconFont.css');


    var buildJS = config.buildJS;
    var jsDirConfig = {
      '': 'es6/',
      'AngularJS 1.x': 'es6ng1/',
      'AngularJS 2.x': 'es6ng2/',   // Not yet implemented
      'React 0.x': 'es6/'           // Not yet implemented
    };

    // Make this.selectedJSFrameworkDir a property of the generator, so the build-tool can use it too
    this.selectedJSFrameworkDir = jsDirConfig[buildJS.framework[0] || ''];

    // Copy JS files
    this.fs.copy(this.templatePath(this.selectedJSFrameworkDir + this.demoOutputModuleDir + '*.js'), paths.input.modulesDir + this.demoOutputModuleDir);

    // Copy TEMPLATE HTML files
    this.fs.copy(this.templatePath(this.selectedJSFrameworkDir  + this.demoOutputModuleDir + 'templates/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.templateDir);


    // Copy unit test(s)
    this.fs.copy(this.templatePath('unitTest/*'), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.unitTestDir);

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


// Special case - in order to tell <entryPoint> that we are using a sample project,
// we need to write some TEMPORARY config IN THIS STAGE, then remove the config in the next stage.
// Additionally, createEntryPointSampleAppConfig() must be called AFTER <paths>, so that the paths config can be found
function createEntryPointSampleAppConfig() {
  // Write temporary config
  if (this.answers.createScaffoldProject) {
    var config = this.getGlobalConfig();
    var modulesDir = config.paths.input.modulesSubDir;

    this.answers.sampleAppEntryPoint = {
      app: [modulesDir + this.demoOutputModuleDir + 'app.js']
    };
  }
}


function removeEntryPointSampleAppConfig() {
  if (this.answers) {
    delete this.answers.sampleAppEntryPoint;  // T
    this.setConfig(this.answers);
  }
}
