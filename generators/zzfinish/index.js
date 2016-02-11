'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var _ = require('lodash');
_.mixin(require('lodash-deep'));
var utils = require('../../lib/utils');

module.exports = confitGen.create({

  configuring: function() {
    this.buildTool.configure.apply(this);
  },

  writing: function() {
    this.buildTool.write.apply(this);

    var config = this.getGlobalConfig();
    var paths = config.paths;

    // Global task-wiring, independent of any particular tool (although there is some knowledge that the child-tasks MUST exist, and how they should be run together).
    this.defineNpmTask('start', ['npm run dev'], 'Alias for `npm run dev` task');
    this.defineNpmTask('dev', ['clean:dev', 'verify', '--parallel verify:watch build:dev serve:dev'], 'Run project in development mode (verify code, create dev build into <%= link(paths.output.devDir) %> folder, serve on **' + config.serverDev.protocol + '://' + config.serverDev.hostname + ':' + config.serverDev.port + '**, watch for changes and reload the browser automatically)');
    this.defineNpmTask('build', ['clean:prod', 'build:prod'], 'Generate production build into <%= link(paths.output.prodDir) %> folder');
    this.defineNpmTask('build:serve', ['build', 'serve:prod'], 'Generate production build and serve on **' + config.serverProd.protocol + '://' + config.serverProd.hostname + ':' + config.serverProd.port + '**');

    // Low-level tasks
    this.defineNpmTask('clean:dev', ['rm -rf ' + paths.output.devDir]);
    this.defineNpmTask('clean:prod', ['rm -rf ' + paths.output.prodDir]);

    updateReadmeFile.call(this, getReadmeTemplateData.call(this));
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


function getReadmeTemplateData() {
  // Generate a README, or update the existing README.md
  var packageJSON = this.readPackageJson();
  var readmeFragments = this.getResources().readme;

  // Make sure the packageJSON has some the mandatory fields
  packageJSON.description = packageJSON.description || '';
  packageJSON.name = packageJSON.name || '';

  var templateData = _.merge({}, packageJSON, readmeFragments, { configFile: this.configFile });

  // Remove the config.readme from the packageJSON, before writing it back to disk
  delete packageJSON.config.readme;
  this.writePackageJson(packageJSON);

  // Some of the template data may also contain EJS templates, so let's parse those templates first.
  var firstPass = parseTemplateThroughEJS(templateData);

  // ...but we may have referenced the un-templated nodes already, which had the original EJS templates in them.
  // So this 2nd pass should fix that...
  return parseTemplateThroughEJS(firstPass);
}


function updateReadmeFile(templateData) {
  //console.log(templateData);

  var readmeFile = this.destinationPath('README.md');

  if (this.fs.exists(readmeFile)) {
    // We have to put some formatting into our data, to allow the README.md file to be updated continuously :(
    // All due to GitHub's handling of HTML comments in markdown.
    // We need to read & write the existing file, replacing the actual values with the template values, ready to re-insert the template values
    var existingReadme = this.fs.read(readmeFile);
    existingReadme = existingReadme.replace(/<!--\[([\w.:\[\]']+)\]-->\n(.*?\n)+?<!--\[\]-->/g, '<!--[$1]-->\n<%- $1 %>\n\n<!--[]-->');

    // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
    this.fs.write(readmeFile, utils.renderEJS(existingReadme, templateData));
  } else {
    // Use the baseline template
    this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), templateData);
  }
}


function parseTemplateThroughEJS(templateData) {
  // Render the text INSIDE ALL THE TEXT PROPERTIES of the templateData object and replace any EJS templates with values from the data.
  return _.deepMapValues(templateData, function(value, path) {
    if (_.isString(value)) {
      return utils.renderEJS(value, templateData);//.trim();
    }
    return value;
  })
}
