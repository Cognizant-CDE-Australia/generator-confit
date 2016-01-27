'use strict';

/**
 * Functions to update the contents of existing files, if the files exist, or simply write the new file.
 *
 * @type {exports|module.exports}
 *
 */

var utils = require('./utils');

const JS_START_TAG = '// START_CONFIT_GENERATED_CONTENT';
const JS_END_TAG = '// END_CONFIT_GENERATED_CONTENT';


function updateJSFile(templateFile, destinationFile, templateData) {
  var tData = templateData || {};
  if (this.fs.exists(destinationFile)) {
    var existingJSFile = this.fs.read(destinationFile);
    var templateFileContents = this.fs.read(templateFile);

    // Determine whether the template contains the start AND end tags. If it does, we only want to place that content into the existing file, not the entire contents.
    var startIndex = templateFileContents.indexOf(JS_START_TAG);
    var endIndex = templateFileContents.indexOf(JS_END_TAG);

    if (startIndex >= 0 && endIndex > startIndex) {
      templateFileContents = templateFileContents.substring(startIndex, endIndex + JS_END_TAG.length) + '\n';
    }

    // In the case where the existing file DOES NOT have the special tags, it won't be changed.
    existingJSFile = existingJSFile.replace(/\/\/ START_CONFIT_GENERATED_CONTENT\n(.*?\n)+?\/\/ END_CONFIT_GENERATED_CONTENT.*\n/g, templateFileContents);

    // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
    this.fs.write(destinationFile, utils.renderEJS(existingJSFile, tData, templateFile));
  } else {
    // Use the baseline template
    this.fs.copyTpl(templateFile, destinationFile, tData);
  }
}



module.exports = {
  updateMarkdownFile: function() {},
  updateJSFile: updateJSFile
};
