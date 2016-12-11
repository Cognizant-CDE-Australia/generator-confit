'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

  // We need to run this AFTER the buildJS generator, in order to read the buildJS.sourceFormat
  // property. Hence, the 'configuring' task contains the prompts, to allow access to the buildJS config.
  configuring: {
    prompting: function() {
      // Bail out if we just want to rebuild from the configuration file
      if (this.rebuildFromConfig) {
        return;
      }

      this.displayTitle('Verify Generator');

      let resources = this.getResources().verify;
      let sourceFormat = this.getGlobalConfig().buildJS.sourceFormat;
      let jsCodingStandards = resources.jsCodingStandard[sourceFormat];

      // Filter the list based on sourceFormat
      let prompts = [
        {
          type: 'list',
          name: 'jsCodingStandard',
          message: 'JavaScript coding standard',
          default: this.getConfig('jsCodingStandard') || jsCodingStandards[0],
          choices: jsCodingStandards,
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
  },
});
