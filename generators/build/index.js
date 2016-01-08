'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  writing: function () {
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
