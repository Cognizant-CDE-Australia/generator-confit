'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

  prompting: function() {
    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Production Server Generator');

    let genDefaults = this.merge(this.getResources().serverDev.defaults, this.getConfig());
    let prompts = [
      {
        type: 'input',
        name: 'port',
        message: 'Server port',
        default: genDefaults.port,
      },
      {
        type: 'input',
        name: 'hostname',
        message: 'Server hostname',
        default: genDefaults.hostname,
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Server protocol',
        choices: [
          'http',
          'https',
        ],
        default: genDefaults.protocol,
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
