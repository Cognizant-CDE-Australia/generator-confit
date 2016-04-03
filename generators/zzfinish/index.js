'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({

  configuring: function() {
    this.buildTool.configure.apply(this);
  },

  writing: function() {
    this.buildTool.write.apply(this);
    this.generateMarkdownFile(this.templatePath('_README.md'), this.destinationPath('README.md'));
    this.generateMarkdownFile(this.templatePath('_CONTRIBUTING.md'), this.destinationPath('CONTRIBUTING.md'));
  },

  install: function() {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false
    });
  }
});


