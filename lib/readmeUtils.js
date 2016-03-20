'use strict';

const _ = require('lodash');
_.mixin(require('lodash-deep'));
let doc = {};   // Persistent store


module.exports = {
  addReadmeDoc: addReadmeDoc,
  generateReadmeFile: generateReadmeFile
};


/**
 * Adds fragments of text to a temporary store, which will be used later to generate a README.md file
 *
 * @param key {String}                  A key to store the text within the data structure, until it is rendered in README.md
 * @param strOrObj {Object|String}      The text to render. It is treated as an EJS template string
 * @param extraData {Object}(optional)  Extra data to apply to the txt-template. By default, the template can see all the Confit configuration data
 */
function addReadmeDoc(key, strOrObj, extraData) {
  var data = _.merge({}, this.getGlobalConfig(), { configFile: this.configFile }, extraData);
  var value;

  // Parse strOrObj as a string or as an object. If object, run EJS over each property
  if (_.isString(strOrObj)) {
    value = this.renderEJS(strOrObj.trim(), data);
  } else {
    value = _.mapValues(strOrObj, propValue => {
      if (_.isArray(propValue)) {
        return propValue.map(value => this.renderEJS(value.toString().trim(), data));
      }
      return this.renderEJS(propValue.toString().trim(), data);
    });
  }
  _.set(doc, key, value);
}


/**
 * Generates / updates the README.md file
 */
function generateReadmeFile() {
  var templateData = getReadmeTemplateData.call(this, { readme: doc }); // Mount the Readme data at the 'readme' key
  var readmeFile = this.destinationPath('README.md');

  if (this.fs.exists(readmeFile)) {
    // We have to put some formatting into our data, to allow the README.md file to be updated continuously :(
    // All due to GitHub's handling of HTML comments in markdown.
    // We need to read & write the existing file, replacing the actual values with the template values, ready to re-insert the template values
    var existingReadme = this.fs.read(readmeFile);
    existingReadme = existingReadme.replace(/<!--\[([\w.:\[\]']+)\]-->\n(.*?\n)+?<!--\[\]-->/g, '<!--[$1]-->\n<%- $1 %>\n\n<!--[]-->');

    // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
    this.fs.write(readmeFile, this.renderEJS(existingReadme, templateData));
  } else {
    // Use the baseline template
    this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'), templateData);
  }
}



function getReadmeTemplateData(readmeData) {
  // Generate a README, or update the existing README.md
  var packageJSON = this.readPackageJson();
  var readmeResourceFragments = this.getResources().readme;

  // Make sure the packageJSON has some the mandatory fields
  packageJSON.description = packageJSON.description || '';
  packageJSON.name = packageJSON.name || '';

  var templateData = _.merge({}, packageJSON, readmeResourceFragments, readmeData, { configFile: this.configFile });
  //console.log(templateData);

  // Some of the template data may also contain EJS templates, so let's parse those templates first.
  var firstPass = parseTemplateThroughEJS.call(this, templateData);

  // ...but we may have referenced the un-templated nodes already, which had the original EJS templates in them.
  // So this 2nd pass should fix that...
  return parseTemplateThroughEJS.call(this, firstPass);
}


function parseTemplateThroughEJS(templateData) {
  // Render the text INSIDE ALL THE TEXT PROPERTIES of the templateData object and replace any EJS templates with values from the data.
  return _.deepMapValues(templateData, value => {
    if (_.isString(value)) {
      return this.renderEJS(value, templateData);
    }
    return value;
  })
}
