'use strict';

const _ = require('lodash');
let doc = {};   // Persistent store


module.exports = {
  addReadmeDoc: addReadmeDoc,
  generateMarkdownFile: generateMarkdownFile
};


/**
 * Adds fragments of text to a temporary store, which will be used later to generate a README.md file
 *
 * @param key {String}                  A key to store the text within the data structure, until it is rendered in README.md
 * @param strOrObj {Object|String}      The text to render. It is treated as an EJS template string
 * @param extraData {Object}(optional)  Extra data to apply to the txt-template. By default, the template can see all the Confit configuration data
 */
function addReadmeDoc(key, strOrObj, extraData) {
  if (!strOrObj) {
    return;
  }

  let data = _.merge({}, this.getGlobalConfig(), { configFile: this.configFile }, extraData);
  let value = this.forEJSInObj(strOrObj, data);

  // If the key exists, create a new object that has a single key, <key>, with a value of <value>
  if (key) {
    value = _.set({}, key, value);
  }
  _.merge(doc, value);
}


/**
 * Generates / updates the README.md file
 */
function generateMarkdownFile(srcFile, destFile) {
  let templateData = getMarkdownTemplateData.call(this, { readme: doc }); // Mount the Readme data at the 'readme' key

  if (this.fs.exists(destFile)) {
    // We have to put some formatting into our data, to allow the README.md file to be updated continuously :(
    // All due to GitHub's handling of HTML comments in markdown.
    // We need to read & write the existing file, replacing the actual values with the template values, ready to re-insert the template values
    var existingReadme = this.fs.read(destFile);
    existingReadme = existingReadme.replace(/<!--\[([\w.:\[\]']+)\]-->\n(.*?\n)+?<!--\[\]-->/g, '<!--[$1]-->\n<%- $1 %>\n\n<!--[]-->');

    // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
    this.fs.write(destFile, this.renderEJS(existingReadme, templateData));
  } else {
    // Use the baseline template
    this.fs.copyTpl(srcFile, destFile, templateData);
  }
}



function getMarkdownTemplateData(markdownData) {
  // Generate a README, or update the existing README.md
  let packageJSON = this.readPackageJson();
  let readmeResourceFragments = this.getResources().readme;

  // Make sure the packageJSON has some the mandatory fields
  packageJSON.description = packageJSON.description || '';
  packageJSON.name = packageJSON.name || '';

  let templateData = _.merge({}, packageJSON, readmeResourceFragments, markdownData, { configFile: this.configFile });
  //console.log(templateData);

  // Some of the template data may also contain EJS templates, so let's parse those templates first.
  let firstPass = this.forEJSInObj(templateData, templateData);

  // ...but we may have referenced the un-templated nodes already, which had the original EJS templates in them.
  // So this 2nd pass should fix that...
  return this.forEJSInObj(firstPass, firstPass);
}
