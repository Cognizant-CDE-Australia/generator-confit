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
      createEntryPointSampleAppConfig(this);
      this.buildTool.writeConfig(this);
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    removeEntryPointSampleAppConfig(this);

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
    var CSSFile = cssCompilerConfig[compiler];
    this.fs.copy(this.templatePath(cssTemplateDir + CSSFile), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + CSSFile);


    // Copy JS files
    var buildJS = config.buildJS;
    var jsDirConfig = {
      '': 'es6/',
      'AngularJS 1.x': 'es6ng1/',
      'AngularJS 2.x': 'es6ng2/',   // Not yet implemented
      'React 0.x': 'es6/'           // Not yet implemented
    };
    var selectedFrameWorkDir = jsDirConfig[buildJS.framework[0] || ''];
    this.fs.copy(this.templatePath(selectedFrameWorkDir + '*.html'), paths.input.srcDir); // index.html file (root file) - do we need to do this here, or should it be in the tool-specific sample app?
    this.fs.copy(this.templatePath(selectedFrameWorkDir + this.demoOutputModuleDir), paths.input.modulesDir + this.demoOutputModuleDir);

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


// Special case - in order to tell <entryPoint> that we are using a sample project,
// we need to write some TEMPORARY config IN THIS STAGE, then remove the config in the next stage.
// Additionally, createEntryPointSampleAppConfig() must be called AFTER <paths>, so that the paths config can be found
function createEntryPointSampleAppConfig(gen) {
  // Write temporary config
  if (gen.answers.createScaffoldProject) {
    var config = gen.getGlobalConfig();
    var modulesDir = config.paths.input.modulesSubDir;

    gen.answers.sampleAppEntryPoint = {
      app: [modulesDir + gen.demoOutputModuleDir + 'app.js']
    };
  }
}


function removeEntryPointSampleAppConfig(gen) {
  if (gen.answers) {
    delete gen.answers.sampleAppEntryPoint;  // T
    gen.setConfig(gen.answers);
  }
}
