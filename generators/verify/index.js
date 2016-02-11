'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');

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
          message: 'JS coding standard',
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
    var config = this.config.getAll();
    var outputDir = config.paths.config.configDir;
    var jsCodingStandard = this.getConfig('jsCodingStandard');

    var cssTemplateFiles = this.getResources().verify.cssCodingStandard[config.buildCSS.sourceFormat].templateFiles;
    var jsTemplateFiles = this.getResources().verify.jsCodingStandard[jsCodingStandard].templateFiles;
    var allTemplateFiles = [].concat(cssTemplateFiles, jsTemplateFiles);
    var demoModuleDir = this.getResources().sampleApp.demoModuleDir;  // We want to ignore this directory when linting!  // TODO: Do this in the sample app?

    allTemplateFiles.forEach(templateFile => {
      this.fs.copyTpl(
        this.templatePath(templateFile.src),
        this.destinationPath(templateFile.dest.replace('(configDir)', outputDir)),
        _.merge({}, config, {demoModuleDir: demoModuleDir})
      );
    });

    // NPM dependencies only for jsCodingStandard - nothing for CSS? Correct. The buildTool has the CSS dependencies
    this.setNpmDevDependenciesFromArray(this.getResources().verify.jsCodingStandard[jsCodingStandard].packages);

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
