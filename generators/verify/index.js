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

      var done = this.async();
      var sourceFormat = this.getGlobalConfig().buildJS.sourceFormat;
      var jsCodingStandardObjs = this.getResources().verify.jsCodingStandard;
      // Only show the linters that are applicable for the selected JS sourceFormat
      var validJSStandards = _.pick(jsCodingStandardObjs, val => val.supportedSourceFormat.indexOf(sourceFormat) > -1);
      var jsCodingStandards = _.keys(validJSStandards);

      // Filter the list based on sourceFormat

      var prompts = [
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
    let outputDir = config.paths.config.configDir;
    let jsCodingStandard = this.getConfig('jsCodingStandard');
    let cssCodingStandard = (config.buildCSS || {}).sourceFormat || resources.defaultCSSCodingStandard;

    // This is project-specific:
    let cssTemplateFiles = resources.cssCodingStandard[cssCodingStandard].templateFiles;
    let jsTemplateFiles = resources.jsCodingStandard[jsCodingStandard].templateFiles;
    let allTemplateFiles = [].concat(cssTemplateFiles, jsTemplateFiles);

    // This is project-specific
    let demoDir = this.getResources().sampleApp.demoDir;  // We want to ignore this directory when linting, initially!  // TODO: Do this in the sample app?
    demoDir = this.renderEJS(demoDir, config);            // This can contain an EJS template, so parse it directly

    allTemplateFiles.forEach(templateFile => {
      this.updateTextFile(
        this.templatePath(templateFile.src),
        this.destinationPath(templateFile.dest.replace('(configDir)', outputDir)),
        _.merge({}, config, {demoDir: demoDir})
      );
    });

    // NPM dependencies only for jsCodingStandard - nothing for CSS? Correct. The buildTool has the CSS dependencies
    this.setNpmDevDependenciesFromArray(resources.jsCodingStandard[jsCodingStandard].packages);

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
