'use strict';

const _ = require('lodash');
let doc = {};   // Persistent store


module.exports = {
  addReadmeDoc: addReadmeDoc,
  generateMarkdownFile: generateMarkdownFile,
};


/**
 * Adds fragments of text to a temporary store, which will be used later to generate a README.md file
 *
 * @param {string} key               A key to store the text within the data structure, until it is rendered in README.md
 * @param {Object|string} strOrObj   The text to render. It is treated as an EJS template string
 * @param {Object} [extraData]       Extra data to apply to the txt-template. By default, the template can see all the Confit configuration data
 * @this generator
 */
function addReadmeDoc(key, strOrObj, extraData) {
  if (!strOrObj) {
    return;
  }

  let data = this.getStandardTemplateData(extraData);
  let value = this.forEJSInObj(strOrObj, data);

  // If the key exists, create a new object that has a single key, <key>, with a value of <value>
  if (key) {
    value = _.set({}, key, value);
  }
  _.merge(doc, value);
}


/**
 * Generates / updates the README.md file
 *
 * @param {string} srcFile    Source file
 * @param {string} destFile   Destination file
 * @this generator
 */
function generateMarkdownFile(srcFile, destFile) {
  let templateData = getMarkdownTemplateData.call(this, {readme: doc}); // Mount the Readme data at the 'readme' key

  if (this.fs.exists(destFile)) {
    // We have to put some formatting into our data, to allow the README.md file to be updated continuously :(
    // All due to GitHub's handling of HTML comments in markdown.
    // We need to read & write the existing file, replacing the actual values with the template values, ready to re-insert the template values
    let existingReadme = this.fs.read(destFile);

    existingReadme = existingReadme.replace(/<!--\[([\w.:\[\]']+)\]-->\n(.*?\n)+?<!--\[\]-->/g, '<!--[$1]-->\n<%- $1 %>\n\n<!--[]-->');

    // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
    this.fs.write(destFile, this.renderEJS(existingReadme, templateData));
  } else {
    // Use the baseline template
    this.fs.copyTpl(srcFile, destFile, templateData);
  }
}


/**
 * Gets the markdown data in preparation for parsing an EJS template string.
 *
 * @param {Object} markdownData Un-parsed object containing EJS strings
 * @return {Object}            The rendered markdown data
 * @this generator
 */
function getMarkdownTemplateData(markdownData) {
  let readmeResourceFragments = this.getResources().readme;

  let templateData = this.getStandardTemplateData(readmeResourceFragments, markdownData);

  // Some of the template data may also contain EJS templates, so let's parse those templates first.
  let firstPass = this.forEJSInObj(templateData, templateData);

  // ...but we may have referenced the un-templated nodes already, which had the original EJS templates in them.
  // So this 2nd pass should fix that...
  return this.forEJSInObj(firstPass, firstPass);
}
