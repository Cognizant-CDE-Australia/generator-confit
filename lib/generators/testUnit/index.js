'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const _ = require('lodash');

module.exports = confitGen.create({

  // Test Frameworks have testPackages
  // The JS source format has no influence on these two things
  configuring: function() {
    let testDependencies = this.getConfig().testDependencies || [];   // read existing dependencies, if they exist
    let selectedFrameworks = this.getGlobalConfig().buildJS.framework || [];
    let frameworkConfig = this.getResources().frameworks;

    // If there is a framework, replace the existing testDependencies with the framework test dependencies
    selectedFrameworks.forEach((framework) => {
      frameworkConfig[framework].frameworkTestPackages.testPackages.forEach((testPackage) => {
        testDependencies.push(testPackage.name);
      });
    });

    this.setConfig({
      testDependencies: _.uniq(testDependencies),
    });

    this.buildTool.configure.apply(this);
  },

});
