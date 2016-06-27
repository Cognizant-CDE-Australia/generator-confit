'use strict';
const confitGen = require('../../lib/ConfitGenerator.js');
const chalk = require('chalk');
const fs = require('fs');
const _ = require('lodash');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config.
      this.hasConfig = this.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasConfig;
    }
  },

  // We need to run this AFTER the buildJS generator, in order to read the buildJS.sourceFormat
  // property. Hence, the 'configuring' task contains the prompts, to allow access to the buildJS config.
  configuring: {
    prompting: function() {
      // Bail out if we just want to rebuild from the configuration file
      if (this.rebuildFromConfig) {
        return;
      }

      this.log(chalk.underline.bold.green('Verify Generator'));

      let done = this.async();
      let sourceFormat = this.getGlobalConfig().buildJS.sourceFormat;
      let jsCodingStandardObjs = this.getResources().verify.jsCodingStandard;
      // Only show the linters that are applicable for the selected JS sourceFormat
      let validJSStandards = _.pick(jsCodingStandardObjs, val => val.supportedSourceFormat.indexOf(sourceFormat) > -1);
      let jsCodingStandards = _.keys(validJSStandards);

      // Filter the list based on sourceFormat
      let prompts = [
        {
          type: 'list',
          name: 'jsCodingStandard',
          message: 'JavaScript coding standard',
          default: this.getConfig('jsCodingStandard') || jsCodingStandards[0],
          choices: jsCodingStandards
        }
      ];

      this.prompt(prompts, function(props) {
        this.answers = this.generateObjFromAnswers(props);

        done();
      }.bind(this));
    },

    configuring: function() {
      // If we have new answers, then change the config
      if (this.answers) {
        this.buildTool.configure.apply(this);
        this.setConfig(this.answers);
      }
    }
  },

  writing: function () {
    // Copy the linting templates
    let config = this.config.getAll();
    let resources = this.getResources().verify;

    // Evaluation-context for the codeConfig.codingStandardExpression
    let context = {
      config,
      resources
    };

    let demoDir = this.getResources().sampleApp.demoDir;  // We want to ignore this directory when linting, initially!
    demoDir = this.renderEJS(demoDir, config);            // This can contain an EJS template, so parse it directly

    // For-each source-code-type to verify, write generator config
    resources.codeToVerify.forEach(codeConfig => {
      this.writeGeneratorConfig(resources[codeConfig.configKey][_.get(context, codeConfig.codingStandardExpression)], {demoDir: demoDir});
    });

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
