'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');


module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;

      // Data that we need for this generator
      this.cssCompilerConfig = {
        stylus: {
          ext: 'styl',
          template: 'app.styl'
        },
        sass: {
          ext: 'sass',
          template: 'app.sass'
        },
        none: {
          ext: 'css',
          template: 'app.css'
        }
      };
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Build CSS Generator'));

    var self = this;
    var done = this.async();

    var prompts = [
      {
        type: 'confirm',
        name: 'includeOlderBrowsers',
        message: 'Supports older browsers (i.e. less than IE10)?',
        default: false
      },
      {
        type: 'list',
        name: 'olderBrowsers',
        message: 'Older browsers',
        choices: [
          'IE10',
          'IE9'
        ],
        default: this.getConfig('olderBrowsers') || 'IE9',
        when: function(answers) {
          return answers.includeOlderBrowsers;
        }
      },
      {
        type: 'list',
        name: 'cssCompiler',
        message: 'Choose a CSS compiler',
        choices: Object.keys(this.cssCompilerConfig),
        default: this.getConfig('cssCompiler') || 'stylus'
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
      // Replace the <stylesDir> tag inside the rootCSSFiles

      // Add an answer for a question we will never ask... spooky! Default to true
      this.answers.autoprefixer = !(this.getConfig('autoprefixer') === false);

      this.setConfig(this.answers);
    }
  },

  writing: function () {
    this.buildTool.write(this);

    var createSampleCode = this.getGlobalConfig().app.createScaffoldProject;

    if (createSampleCode) {
      //insert a CSS-source file in stylesDir
      var srcTmpDir = '../templates/src/';
      var paths = this.getGlobalConfig().paths;
      var compiler = this.getConfig('cssCompiler');
      var srcStylesDir = srcTmpDir + 'modules/' + this.demoOutputModuleDir + 'styles/';

      var CSSFile = this.cssCompilerConfig[compiler].template;

      this.fs.copy(this.templatePath(srcStylesDir + CSSFile), paths.input.modulesDir + this.demoOutputModuleDir + paths.input.stylesDir + CSSFile);
    }
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true
    });
  }
});
