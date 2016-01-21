'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;
    }
  },

  prompting: function () {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.log(chalk.underline.bold.green('Verify Generator'));

    var done = this.async();
    var jsLinters = this.getResources().verify.jsLinters;

    var prompts = [
      {
        type: 'checkbox',
        name: 'jsLinter',
        message: 'JavaScript linting',
        default: this.getConfig('jsLinter') || jsLinters[0],
        choices: jsLinters
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
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function () {
    // Copy the linting templates
    var config = this.config.getAll();
    var outputDir = config.paths.config.configDir;

    var jsLinters = this.getConfig('jsLinter');
    var gen = this;

    // Create a "linters" property, which is a combination of ALL linters
    var linters = [].concat(jsLinters);
    var cssLinter = this.getResources().css[config.buildCSS.cssCompiler].linter;

    if (cssLinter) {
      linters.push(cssLinter);
    }

    var existingConfig = this.getConfig();
    existingConfig.linters = linters;
    this.setConfig(existingConfig);

    var linterFiles = this.getResources().verify.linterFiles; // A list of files to copy (src & dest) per linter
    var demoModuleDir = this.getResources().sampleApp.demoModuleDir;  // We want to ignore this!  // TODO: Do this in the sample app?

    // TODO: Need to consider different linting options for ES5 vs ES6 source code?!? OR do we deprecate ES5?
    linters.forEach(function(linter) {
      linterFiles[linter].forEach(function (linterFile) {
        gen.fs.copyTpl(
          gen.templatePath(linterFile.src),
          gen.destinationPath(linterFile.dest.replace('(configDir)', outputDir)),
          _.merge({}, config, {demoModuleDir: demoModuleDir})
        );
      });
    });


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
