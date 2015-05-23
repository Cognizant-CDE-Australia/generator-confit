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
        choices: [
          'stylus',
          'sass',
          'none'
        ],
        default: this.getConfig('cssCompiler') || 'stylus'
      },
      // {
      //   type: 'list',
      //   name: 'CSSlibrary',
      //   message: 'Choose a CSS library',
      //   choices: [
      //     'bootstrap',
      //     'none'
      //   ],
      //   default: this.config.get('CSSlibrary') || 'bootstrap'
      // },
      {
        type: 'confirm',
        name: 'autoprefixer',
        message: 'Use Autoprefixer?',
        default: true
      },
      {
        type: 'input',
        name: 'externalCSSDir',
        message: 'Path to external CSS file(s) to copy? (comma separated list, or "none")',
        default: this.getConfig('externalCSSDir') || 'none'
      },
      {
        type: 'input',
        name: 'rootCSSFiles',
        message: 'Path to root CSS file(s) (comma separated list, or "none")',
        default: this.getConfig('rootCSSFiles') || 'none'
      }
    ];


    this.prompt(prompts, function (props) {
      this.answers = this.generateObjFromAnswers(props);

      if (this.answers.rootCSSFiles != 'none') {
        var CSSfilesArr = this.answers.rootCSSFiles.split(',');
        for (var i = 0; i < CSSfilesArr.length; i++){
          CSSfilesArr[i] = CSSfilesArr[i].trim();
        }
        this.answers.rootCSSFiles = CSSfilesArr;
      }

      if (this.answers.externalCSSDir != 'none') {
        CSSfilesArr = this.answers.externalCSSDir.split(',');
        for (var i = 0; i < CSSfilesArr.length; i++){
          CSSfilesArr[i] = CSSfilesArr[i].trim();
        }
        this.answers.externalCSSDir = CSSfilesArr;
      }
      done();
    }.bind(this));

  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    this.buildTool.write(this);

    if (this.getConfig('externalCSSDir') === 'none') {
      //insert a CSScompiler file in stylesDir
      var srcTmpDir = '../templates/src/';
      var stylesDir = srcTmpDir + 'modules/demoModule/styles/';
      var CSSfile = 'app.css';
      var paths = this.getGlobalConfig().paths;

      if (this.getConfig('cssCompiler') === 'stylus') {
        CSSfile = 'app.styl';
      }
      else if (this.getConfig('cssCompiler') === 'sass') {
        CSSfile = 'app.scss';
      }
      this.fs.copy(this.templatePath(stylesDir + CSSfile), paths.input.modulesDir + 'demoModule/' + paths.input.stylesDir + CSSfile);
    }
  }

});
