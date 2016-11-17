'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

let docGenDefaults = {};

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();

      let resources = this.getResources().documentation;

      docGenDefaults = this.merge(resources.defaults, this.getConfig());
    },
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Documentation Generator');

    let resources = this.getResources().documentation;

    // Filter out GitHub as a publishing option if the project is not a GitHub project
    let publishMethods = resources.publishMethods.filter((options) => this.isProjectHostedOnGitHub() || options.value !== resources.GITHUB_PUBLISH_METHOD);

    // If the project is hosted on GitHub, set GitHub as the default publishing method
    docGenDefaults.publishMethod = this.isProjectHostedOnGitHub() ? resources.GITHUB_PUBLISH_METHOD : docGenDefaults.publishMethod;

    let prompts = [
      {
        type: 'confirm',
        name: 'generateDocs',
        message: 'Would you like to generate documentation?',
        default: docGenDefaults.generateDocs,
      },
      {
        type: 'input',
        name: 'srcDir',
        message: 'Documentation SOURCE directory',
        default: docGenDefaults.srcDir,
        validate: this.validatePath,
        when: (answers) => answers.generateDocs,
      },
      {
        type: 'input',
        name: 'outputDir',
        message: 'Documentation OUTPUT directory',
        default: docGenDefaults.outputDir,
        validate: this.validatePath,
        when: (answers) => answers.generateDocs,
      },
      {
        type: 'list',
        name: 'publishMethod',
        message: 'How should documentation be published?',
        default: docGenDefaults.publishMethod,
        choices: publishMethods,
        when: (answers) => answers.generateDocs,
      },
      {
        type: 'confirm',
        name: 'createSampleDocs',
        message: 'Create sample documentation?',
        default: docGenDefaults.createSampleDocs,
        when: (answers) => answers.generateDocs,
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    let config = this.answers || this.getConfig();

    // We MUST filter here otherwise our tests don't really work
    if (config.generateDocs) {
      config.srcDir = this.filterPath(config.srcDir, 'srcDir', {srcDir: docGenDefaults.srcDir});
      config.outputDir = this.filterPath(config.outputDir, 'outputDir', {outputDir: docGenDefaults.outputDir});
    }

    if (this.answers) {
      this.buildTool.configure.apply(this);
    }

    this.setConfig(config);
  },

  writing: function() {
    if (!this.getConfig('generateDocs')) {
      return;
    }

    let resources = this.getResources().documentation;

    this.writeGeneratorConfig(resources);
    this.buildTool.write.apply(this);
  },

  install: function() {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false,
    });
  },
});
