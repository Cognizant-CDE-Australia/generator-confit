'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();
    }
  },

  // We need to run this AFTER the buildJS generator and paths generator, in order to read the buildJS.sourceFormat
  // property. Hence, the 'configuring' task contains the prompts, to allow access to the buildJS config.
  configuring: {
    prompting: function() {
      // Bail out if we just want to rebuild from the configuration file
      if (this.rebuildFromConfig && this.getConfig('createSampleApp') === false) {
        return;
      }

      let resources = this.getResources().sampleApp;
      let genDefaults = this.merge(resources.defaults, this.getConfig());

      // Check if the build-profile's buildTool's sampleApp generator supports the selected configuration
      let buildJS = this.getGlobalConfig().buildJS;
      let jsSourceFormat = buildJS.sourceFormat;
      let selectedFramework = buildJS.framework[0] || '';
      let frameworkConfig = this.getResources().frameworks;

      if (!frameworkConfig[selectedFramework][jsSourceFormat]) {
        this.displayWarning('A sample application is not available for the selected JS framework + source code combination.');
        this.answers = {
          createSampleApp: false
        };
        return;
      }

      this.displayTitle('Sample App Generator');

      let prompts = [
        {
          type: 'confirm',
          name: 'createSampleApp',
          message: 'Create a sample app?',
          default: genDefaults.createSampleApp
        }
      ];


      return this.prompt(prompts).then(function(props) {
        this.answers = this.generateObjFromAnswers(props);
      }.bind(this));
    },

    configuring: function() {
      // If we have new answers, then change the config
      if (this.answers) {
        // If we don't want to create a sample app, don't bother calling the buildTool.
        if (this.answers.createSampleApp) {
          this.buildTool.configure.apply(this);
        }
        this.setConfig(this.answers);
      }
    }
  },

  writing: function() {
    if (!this.getConfig('createSampleApp')) {
      return;
    }

    // Write the common generator config
    let resources = this.getResources().sampleApp;

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
