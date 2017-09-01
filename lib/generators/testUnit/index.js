'use strict';
const confitGen = require('../../core/ConfitGenerator.js');
const _ = require('lodash');

module.exports = confitGen.create({

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Unit Test Generator');

    let resources = this.getResources().testUnit;
    let genDefaults = this.merge(resources.defaults, this.getConfig());

    let prompts = [
      {
        type: 'list',
        name: 'testFramework',
        message: 'Test framework',
        choices: resources.testFrameworks,
        default: genDefaults.testFramework,
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
    }.bind(this));
  },

  // Test Frameworks have testPackages
  // The JS source format has no influence on these two things
  configuring: function() {
    let testDependencies = this.getConfig().testDependencies || []; // read existing dependencies, if they exist
    let selectedFrameworks = this.getGlobalConfig().buildJS.framework || [];
    let frameworkConfig = this.getResources().frameworks;

    // If there is a framework, replace the existing testDependencies with the framework test dependencies
    selectedFrameworks.forEach((framework) => {
      frameworkConfig[framework].frameworkTestPackages.testPackages.forEach((testPackage) => {
        testDependencies.push(testPackage.name);
      });
    });

    // Get the new answers (if they exist) or the existing config, modify it with the test dependencies
    let config = this.answers || this.getConfig();

    config.testDependencies = _.uniq(testDependencies);
    this.setConfig(config);

    this.buildTool.configure.apply(this);
  },

});
