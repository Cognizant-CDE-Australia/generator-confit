'use strict';
const path = require('path');
const _ = require('lodash');

module.exports = {
  copyGeneratorTemplates: copyGeneratorTemplates,
  copyToolTemplates: copyToolTemplates,
  copyIfNotExist:copyIfNotExist,
  updateJSFile: updateJSFile,
  updateTextFile: updateTextFile,
  updateYAMLFile: updateYAMLFile
};


const JS_BLOCK_DELIMS = {
  startTag: '// START_CONFIT_GENERATED_CONTENT',
  endTag: '// END_CONFIT_GENERATED_CONTENT',
  regEx: /\/\/ START_CONFIT_GENERATED_CONTENT\n(.*?\n)+?\/\/ END_CONFIT_GENERATED_CONTENT.*\n/g
};

const YML_BLOCK_DELIMS = {
  startTag: '# START_CONFIT_GENERATED_CONTENT',
  endTag: '# END_CONFIT_GENERATED_CONTENT',
  regEx: /# START_CONFIT_GENERATED_CONTENT\n(.*?\n)+?# END_CONFIT_GENERATED_CONTENT.*\n/g
};
const FILE_TYPE_MAP = {
  '.yml': YML_BLOCK_DELIMS,
  '.js': JS_BLOCK_DELIMS
};

/**
 * Update the contents of existing JavaScript files that have JS_START_TAG & JS_END_TAGs
 * inside them, changing the content between these tags only
 *
 * @param templateFile
 * @param destinationFile
 * @param templateData
 */
function updateJSFile(templateFile, destinationFile, templateData) {
  updateTextFile.call(this, templateFile, destinationFile, templateData, JS_BLOCK_DELIMS);
}

/**
 * Update the contents of existing YAML files that have YML_START_TAG & YML_END_TAGs
 * inside them, changing the content between these tags only
 *
 * @param templateFile
 * @param destinationFile
 * @param templateData
 */
function updateYAMLFile(templateFile, destinationFile, templateData) {
  updateTextFile.call(this, templateFile, destinationFile, templateData, YML_BLOCK_DELIMS);
}


/**
 * Update the contents of any text files that has the required start and end tag blocks
 * changing the content between these tags only
 *
 * @param templateFile
 * @param destinationFile
 * @param templateData
 * @param delimObj {object}   An object containing the startTag string, endTag string, and a regular expression for matching the content between the start and end tag
 */
function updateTextFile(templateFile, destinationFile, templateData, delimObj) {
  let tData = templateData || {};

  // If we don't get a delimObj, look at the source file name to figure out what kind of delims to use
  if (!delimObj) {
    delimObj = FILE_TYPE_MAP[path.extname(templateFile)] || JS_BLOCK_DELIMS;
  }

  if (this.fs.exists(destinationFile)) {
    let templateFileContents = this.fs.read(templateFile);
    let existingJSFile = this.fs.read(destinationFile);

    // Determine whether the template contains the start AND end tags. If it does, we only want to place that content into the existing file, not the entire contents.
    let startIndex = templateFileContents.indexOf(delimObj.startTag);
    let endIndex = templateFileContents.indexOf(delimObj.endTag);

    if (startIndex >= 0 && endIndex > startIndex) {
      templateFileContents = templateFileContents.substring(startIndex, endIndex + delimObj.endTag.length) + '\n';
    }

    // In the case where the existing file DOES NOT have the special tags, it won't be changed.
    existingJSFile = existingJSFile.replace(delimObj.regEx, templateFileContents);

    // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
    this.fs.write(destinationFile, this.renderEJS(existingJSFile, tData, templateFile));
  } else {
    let existingFile = this.fs.read(templateFile);
    this.fs.write(destinationFile, this.renderEJS(existingFile, tData, templateFile));
  }
}


/**
 * Only copies the srcFile to the destinationFile if the destination file does not exist
 * @param srcFile
 * @param destinationFile
 */
function copyIfNotExist(srcFile, destinationFile, tData) {
  if (!this.fs.exists(destinationFile)) {
    let existingFile = this.fs.read(srcFile);
    this.fs.write(destinationFile, this.renderEJS(existingFile, tData, srcFile));
  }
}


function copyTemplateFiles(arrayOfTemplateFiles, extraTemplateData, srcPathFn) {
  var tData = this.getStandardTemplateData(extraTemplateData);

  (arrayOfTemplateFiles || []).forEach(fileDef => {
    if (fileDef.type === 'binary') {
      this.fs.copy(
        this[srcPathFn](fileDef.src),
        this.destinationPath(this.renderEJS(fileDef.dest, tData))
      );
    } else {
      let fileOperationFn = (fileDef.overwrite) ? updateTextFile : copyIfNotExist;

      fileOperationFn.call(
        this,
        this[srcPathFn](fileDef.src),
        this.destinationPath(this.renderEJS(fileDef.dest, tData)),
        tData
      );
    }
  });
}

/**
 * This method is designed to be used on the "templateFiles" array in "...resource.yml" files.
 * Each item in "templateFiles" contains a "src" property (which is relative to the buildTool
 * generator which is calling this method), a "dest" property which is relative to the destination
 * path, and a flag indicating whether the file should overwrite existing files or not.
 *
 * @param arrayOfTemplateFiles {Array}  An array of {src, dest, overwrite<boolean>} objects
 */
function copyToolTemplates(arrayOfTemplateFiles, templateData) {
  copyTemplateFiles.call(this, arrayOfTemplateFiles, templateData, 'toolTemplatePath');
}


/**
 * This method is designed to be used on the "templateFiles" array in the main "resource.yml" file.
 * Each item in "templateFiles" contains a "src" property (which is relative to the  generator which
 * is calling this method), a "dest" property which is relative to the destination
 * path, and a flag indicating whether the file should overwrite existing files or not.
 *
 * @param arrayOfTemplateFiles {Array}  An array of {src, dest, overwrite<boolean>} objects
 */
function copyGeneratorTemplates(arrayOfTemplateFiles, templateData) {
  copyTemplateFiles.call(this, arrayOfTemplateFiles, templateData, 'templatePath');
}
