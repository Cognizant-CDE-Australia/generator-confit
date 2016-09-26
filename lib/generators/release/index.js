'use strict';
let confitGen = require('../../core/ConfitGenerator.js');


module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();
    }
  },

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Release Generator');

    let resources = this.getResources().release;
    let genDefaults = this.merge(resources.defaults, this.getConfig());
    let commitMessageFormats = resources.commitMessageFormats;

    let prompts = [
      {
        type: 'confirm',
        name: 'useSemantic',
        message: 'Use semantic releasing?',
        default: genDefaults.useSemantic
      },
      {
        type: 'list',
        name: 'commitMessageFormat',
        message: 'Commit message format',
        default: genDefaults.commitMessageFormat,
        choices: answers => commitMessageFormats.filter(format => {
          return !(answers.useSemantic && format === 'None');
        })
      }
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);

      if (this.answers.useSemantic === false) {
        this.displayWarning('This project must be manually configured to generate a release. (No semantic releasing tools)');
      }
    }.bind(this));
  },

  configuring: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

  writing: function() {
    let resources = this.getResources().release;

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
