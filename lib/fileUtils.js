'use strict';

/**
 * Functions to update the contents of existing files, if the files exist, or simply write the new file.
 *
 * @type {exports|module.exports}
 *
 */

const JS_START_TAG = '// START_CONFIT_GENERATED_CONTENT';
const JS_END_TAG = '// END_CONFIT_GENERATED_CONTENT';

/**
 * Update the contents of existing JavaScript files that have JS_START_TAG & JS_END_TAGs
 * inside them, changing the content between these tags only
 *
 *
 * @param templateFile
 * @param destinationFile
 * @param templateData
 */
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
    this.fs.write(destinationFile, this.renderEJS(existingJSFile, tData, templateFile));
  } else {
    // Use the baseline template
    this.fs.copyTpl(templateFile, destinationFile, tData);
  }
}

/**
 * Only copies the srcFile to the destinationFile if the destination file does not exist
 * @param srcFile
 * @param destinationFile
 */
function copyIfNotExist(srcFile, destinationFile, tData) {
  if (!this.fs.exists(destinationFile)) {
    this.fs.copyTpl(srcFile, destinationFile, tData || {});
  }
}


module.exports = {
  copyIfNotExist:copyIfNotExist,
  updateJSFile: updateJSFile
};
