'use strict';
let confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

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
});
