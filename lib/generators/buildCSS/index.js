'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Build CSS Generator');

    let resources = this.getResources().buildCSS;
    let genDefaults = this.merge(resources.defaults, this.getConfig());

    let prompts = [
      {
        type: 'list',
        name: 'sourceFormat',
        message: 'CSS source format',
        choices: Object.keys(resources.sourceFormat),
        default: genDefaults.sourceFormat,
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.answers = this.generateObjFromAnswers(props);
    }.bind(this));
  },

  configuring: function() {
    if (this.answers) {
      // Add an answer for a question we will never ask... spooky! Default to true
      this.answers.autoprefixer = !(this.getConfig('autoprefixer') === false);
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },
});
