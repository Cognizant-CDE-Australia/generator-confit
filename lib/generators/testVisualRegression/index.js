'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

let genDefaults = {};   // Used in multiple task-blocks, so that's why it's here

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();

      let resources = this.getResources().testVisualRegression;
      genDefaults = this.merge(resources.defaults, this.getConfig());
    }
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Visual Regression Testing Generator');

    let prompts = [
      {
        type: 'confirm',
        name: 'enabled',
        message: 'Would you like to enable visual regression testing?',
        default: genDefaults.enabled
      },
      {
        type: 'input',
        name: 'moduleTestDir',
        message: 'Visual regression MODULE sub-directory name (relative to each module)',
        default: genDefaults.moduleTestDir,
        validate: this.validatePath,
        when: answers => answers.enabled
      },
      {
        type: 'input',
        name: 'referenceImageDir',
        message: 'Visual regression REFERENCE IMAGES directory',
        default: genDefaults.referenceImageDir,
        validate: this.validatePath,
        when: answers => answers.enabled
      }
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers OR we need to modify the config, write the config.
    let config = this.answers || this.getConfig();

    // We MUST filter here otherwise our tests don't really work
    if (config.enabled) {
      config.moduleTestDir = this.filterPath(config.moduleTestDir, 'moduleTestDir', {moduleTestDir: genDefaults.moduleTestDir});
      config.referenceImageDir = this.filterPath(config.referenceImageDir, 'referenceImageDir', {referenceImageDir: genDefaults.referenceImageDir});
    }

    // Maybe we need to do this everytime?
    if (this.answers) {
      this.buildTool.configure.apply(this);
    }

    this.setConfig(config);
  },

  writing: function() {
    if (!this.getConfig('enabled')) {
      return;
    }

    let resources = this.getResources().testVisualRegression;

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
