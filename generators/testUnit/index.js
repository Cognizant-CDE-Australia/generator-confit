'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');

module.exports = confitGen.create({

  configuring: function() {
    var testDependencies = [];

    if (this.getGlobalConfig().buildJS.framework.length) {
      var selectedFramework = this.getGlobalConfig().buildJS.framework[0];
      var testDeps = this.getResources().buildJS.frameworks[selectedFramework].testPackages;
      testDependencies = testDeps.map(pkg => pkg.name);
    }

    this.setConfig({
      testDependencies: testDependencies
    });

    this.buildTool.configure.apply(this);
  },

  writing: function () {
    // Need to install test frameworks for the selected JS Library
    if (this.getGlobalConfig().buildJS.framework.length) {
      var selectedFramework = this.getGlobalConfig().buildJS.framework[0];
      var testDeps = this.getResources().buildJS.frameworks[selectedFramework].testPackages;

      // We need to store the test dependency names against the config, so that our build tools can
      // add these "extra" dependencies to the test harnesses

      this.setNpmDevDependenciesFromArray(testDeps);
      this.ts.addTypeLibsFromArray(this.getResources().buildJS.frameworks[selectedFramework].testTypeLibs);
    }

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
