'use strict';
const confitGen = require('../../core/ConfitGenerator.js');

module.exports = confitGen.create({

  configuring: function() {
    this.buildTool.configure.apply(this);
  },

  writing: function() {
    let resources = this.getResources().zzfinish;

    this.writeGeneratorConfig(resources);
    this.buildTool.write.apply(this);

    // Special! Only place we call generateMarkdownFile()
    this.generateMarkdownFile(this.templatePath('_README.md'), this.destinationPath('README.md'));
    this.generateMarkdownFile(this.templatePath('_CONTRIBUTING.md'), this.destinationPath('CONTRIBUTING.md'));
  },

  install: function() {
    // Sort the package.json
    const sortPkg = require('sort-package-json');
    let data = this.readPackageJson();

    this.writePackageJson(sortPkg(data));

    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false,
    });
  },
});


