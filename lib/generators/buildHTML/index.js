'use strict';
let confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({
  initializing: {
    init: function() {
      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.rebuildFromConfig = Boolean(this.options.rebuildFromConfig) && this.hasExistingConfig();
    },
  },

  prompting: function() {
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Build HTML Generator');

    let resources = this.getResources().buildHTML;
    let genDefaults = this.merge(resources.defaults, this.getConfig());

    let prompts = [
      {
        type: 'list',
        name: 'extension',
        message: 'HTML source file extension?',
        choices: [
          '.html',
          '.htm',
        ],
        default: genDefaults.extension,
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
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
    let resources = this.getResources().buildHTML;

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
