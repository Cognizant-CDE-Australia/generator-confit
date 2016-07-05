'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');
const _ = require('lodash');

module.exports = confitGen.create({

  configuring: function() {
    let testDependencies = this.getConfig().testDependencies || [];   // read existing dependencies, if they exist

    let frameworks = this.getGlobalConfig().buildJS.framework || [];
    if (frameworks.length) {
      let selectedFramework = frameworks[0];
      let testDeps = this.getResources().buildJS.frameworks[selectedFramework].testPackages;
      testDependencies = testDeps.map(pkg => pkg.name);
    }

    this.setConfig({
      testDependencies: _.uniq(testDependencies)
    });

    this.buildTool.configure.apply(this);
  },

  writing: function () {
    // Need to install test frameworks for the selected JS Framework
    let frameworks = this.getGlobalConfig().buildJS.framework || [];
    if (frameworks.length) {
      let selectedFramework = frameworks[0];
      let testDeps = this.getResources().buildJS.frameworks[selectedFramework].testPackages;

      // We need to store the test dependency names against the config, so that our build tools can
      // add these "extra" dependencies to the test harnesses

      // Before we add them as dev dependencies, filter the ones that are already dependencies
      let deps = this.readPackageJson().dependencies || {};
      testDeps = testDeps.filter(testDep => !deps[this.getBasePackageName(testDep)]);

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
