'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: {
    preInit: function() {
      common = require('../app/common')(this, 'buildCSS');
      buildTool = common.getBuildTool();
    },
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = common.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig || this.useDefaults) {
      return;
    }

    this.log(chalk.underline.bold.green('Project BuildCSS Generator'));

    var self = this;
    var done = this.async();

    var prompts = [
      {
        type: 'confirm',
        name: 'includeOlderBrowsers',
        message: 'Supports older browsers (i.e. <IE10)? (y/n)',
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
        default: this.config.get('olderBrowsers') || 'IE9',
        when: function(answers){ return answers.includeOlderBrowsers; }
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
        default: this.config.get('cssCompiler') || 'stylus'
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
        message: 'Autoprefixer? (y/n)',
        default: true
      },
      {
        type: 'input',
        name: 'externalCSSDir',
        message: 'Path to external CSS directory(s) to copy? (comma separated list, or "none")',
        default: this.config.get('externalCSSDir') || 'none'
      },
      {
        type: 'input',
        name: 'rootCSSFiles',
        message: 'Path to root CSS file(s) (comma separated list, or "none")',
        default: this.config.get('rootCSSFiles') || 'none'
      }    
    ];

    this.prompt(prompts, function (props) {
      if (props.useDefaults === true) {
        this.useDefaults = true;
        this.answers = common.generateObjFromAnswers(this.defaults);
      } else {
        delete props.useDefaults;   // We don't want to store this in our config
        this.answers = common.generateObjFromAnswers(props);

        if(this.answers.rootCSSFiles != 'none'){ 
        var CSSfilesArr = this.answers.rootCSSFiles.split(',');
        for (var i = 0; i < CSSfilesArr.length; i++){
          CSSfilesArr[i] = CSSfilesArr[i].trim();
        }
        this.answers.rootCSSFiles = CSSfilesArr;
        }
        
        if(this.answers.externalCSSDir != 'none'){
          CSSfilesArr = this.answers.externalCSSDir.split(',');
          for (var i = 0; i < CSSfilesArr.length; i++){
            CSSfilesArr[i] = CSSfilesArr[i].trim();
          }
          this.answers.externalCSSDir = CSSfilesArr;
        }

        //this.log(this.answers);

      }

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
    buildTool.write(this, common);

    if(common.getConfig('externalCSSDir') === 'none'){
      //insert a CSScompiler file in stylesDir
      var srcTmpDir = '../templates/src/';
      var stylesDir = srcTmpDir + 'modules/demoModule/styles/';
      var CSSfile = 'app.css';
      var paths = this.config.getAll().paths;
      if (common.getConfig('cssCompiler') === 'stylus'){
        CSSfile = 'app.styl'; }
      else if (common.getConfig('cssCompiler') === 'sass'){
        CSSfile = 'app.scss'; }
      this.fs.copy(this.templatePath(stylesDir + CSSfile), paths.input.modulesDir + 'demoModule/' + paths.input.stylesDir + '/' + CSSfile);
    }

  }

});
