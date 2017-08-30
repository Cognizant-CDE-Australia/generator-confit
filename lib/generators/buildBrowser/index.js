'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

  prompting: function() {
    if (this.rebuildFromConfig) {
      return;
    }

    this.displayTitle('Build Browser Generator');

    let resources = this.getResources().buildBrowser;
    let genDefaults = this.merge(resources.defaults, this.getConfig());
    let browsers = resources.supportedBrowsers;
    let browserObjList = Object.keys(browsers).map((browser) => {
      return {value: browser, name: browsers[browser].label};
    });

    let prompts = [
      {
        type: 'checkbox',
        name: 'browserSupport',
        message: 'Supported browsers (required)',
        choices: browserObjList,
        default: genDefaults.browserSupport,
        validate: (answer) => answer.length > 0, // Must select at-least one
      },
    ];

    return this.prompt(prompts).then(function(answers) {
      this.answers = this.generateObjFromAnswers(answers, prompts);
    }.bind(this));
  },

  configuring: function() {
    if (this.answers) {
      this.buildTool.configure.apply(this);
      this.setConfig(this.answers);
    }
  },

});


