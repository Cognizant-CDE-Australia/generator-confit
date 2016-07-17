'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

  configuring: function() {
    this.buildTool.configure.apply(this);
  },

  writing: function() {
    let resources = this.getResources().testBrowser;

    this.writeGeneratorConfig(resources);
    this.buildTool.write.apply(this);
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
