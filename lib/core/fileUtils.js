'use strict';
const path = require('path');
const _ = require('lodash');

module.exports = {
  copyGeneratorTemplates,
  copyToolTemplates,
  copyIfNotExist,
  filterPath,
  updateJSFile,
  updateTextFile,
  updateYAMLFile,
  validatePath
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
 * @param {string} templateFile     JS file to update
 * @param {string} destinationFile  Destination file
 * @param {string} templateData     Template data
 * @returns {undefined}
 * @this generator
 */
function updateJSFile(templateFile, destinationFile, templateData) {
  updateTextFile.call(this, templateFile, destinationFile, templateData, JS_BLOCK_DELIMS);
}

/**
 * Update the contents of existing YAML files that have YML_START_TAG & YML_END_TAGs
 * inside them, changing the content between these tags only
 *
 * @param {string} templateFile     YAML file to update
 * @param {string} destinationFile  Destination file
 * @param {string} templateData     Template data
 * @returns {undefined}
 * @this generator
 */
function updateYAMLFile(templateFile, destinationFile, templateData) {
  updateTextFile.call(this, templateFile, destinationFile, templateData, YML_BLOCK_DELIMS);
}


/**
 * Update the contents of any text files that has the required start and end tag blocks
 * changing the content between these tags only
 *
 * @param {string} templateFile     JS file to update
 * @param {string} destinationFile  Destination file
 * @param {string} templateData     Template data
 * @param {object} delimObj         An object containing the startTag string, endTag string, and a regular expression for matching the content between the start and end tag
 * @returns {undefined}
 * @this generator
 */
function updateTextFile(templateFile, destinationFile, templateData, delimObj) {
  let tData = templateData || {};
  let destExists = this.fs.exists(destinationFile);

  // If we don't get a delimObj, look at the source file name to figure out what kind of delims to use
  if (!delimObj) {
    delimObj = FILE_TYPE_MAP[path.extname(templateFile)] || JS_BLOCK_DELIMS;
  }

  if (destExists) {
    let templateFileContents = this.fs.read(templateFile);
    let existingJSFile = this.fs.read(destinationFile);
    let startIndex = 0;
    let endIndex = 0;
    let fragments = [];

    // Determine whether the template contains the start AND end tags. If it does, we only want to place that content into the existing file, not the entire contents.
    while (true) {
      startIndex = templateFileContents.indexOf(delimObj.startTag, endIndex);
      endIndex = templateFileContents.indexOf(delimObj.endTag, startIndex);

      if (startIndex >= 0 && endIndex > startIndex) {
        fragments.push(templateFileContents.substring(startIndex, endIndex + delimObj.endTag.length) + '\n');
      } else {
        break;
      }
    }

    let numMatches = (existingJSFile.match(delimObj.regEx) || []).length;

    if (numMatches === 0 && fragments.length === 0) {
      //console.log('num matches', numMatches);
      destExists = false; // Overwrite the file
    } else {

      // In the case where the existing file DOES NOT have the special tags, it won't be changed.
      existingJSFile = existingJSFile.replace(delimObj.regEx, function() {
        let result = '';
        // If there are multiple fragments left but no more places to insert them in the existing file,
        // return ALL of the remaining fragments

        if (numMatches === 1 && fragments.length > 1) {
          result = fragments.join('\n');
        } else {
          result = fragments.shift();
        }
        numMatches--;
        return result;
      });

      //if (templateFile.indexOf('karma.common.js.tpl') != -1) {
      //  console.log(templateFileContents);
      //}

      // Use EJS directly because we are changing the existing file (and Yeoman is getting confused).
      this.fs.write(destinationFile, this.renderEJS(existingJSFile, tData, templateFile));
    }
  }

  if (!destExists) {
    let existingFile = this.fs.read(templateFile);

    this.fs.write(destinationFile, this.renderEJS(existingFile, tData, templateFile));
  }
}


/**
 * Only copies the srcFile to the destinationFile if the destination file does not exist
 * @param {string} srcFile          File to copy
 * @param {string} destinationFile  Where to copy the file
 * @param {string} templateData     Template data
 * @returns {undefined}
 * @this generator
 */
function copyIfNotExist(srcFile, destinationFile, templateData) {
  if (!this.fs.exists(destinationFile)) {
    let existingFile = this.fs.read(srcFile);

    this.fs.write(destinationFile, this.renderEJS(existingFile, templateData, srcFile));
  }
}

/**
 *
 * @param {string[]} arrayOfTemplateFiles   An array of {src, dest, overwrite<boolean>} objects
 * @param {Object} templateData      Template data
 * @param {string} srcPathFn         Destination path
 * @returns {undefined}
 * @this generator
 */
function copyTemplateFiles(arrayOfTemplateFiles, templateData, srcPathFn) {
  let tData = this.getStandardTemplateData(templateData);

  (arrayOfTemplateFiles || []).forEach(fileDef => {
    // Do not try to use templates when noParse === true
    if (fileDef.noParse === true) {
      this.fs.copy(
        this[srcPathFn](fileDef.src),
        this.destinationPath(this.renderEJS(fileDef.dest, tData))
      );
    } else if (fileDef.src.indexOf('*') > -1) { // If we are using wildcards, use copyTpl()
      this.fs.copyTpl(
        this[srcPathFn](fileDef.src),
        this.destinationPath(this.renderEJS(fileDef.dest, tData)),
        tData
      );
    } else {
      let fileOperationFn = fileDef.overwrite ? updateTextFile : copyIfNotExist;

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
 * @param {string[]} arrayOfTemplateFiles   An array of {src, dest, overwrite<boolean>} objects
 * @param {Object} templateData      Template data
 * @returns {undefined}
 * @this generator
 */
function copyToolTemplates(arrayOfTemplateFiles, templateData) {
  copyTemplateFiles.call(this, arrayOfTemplateFiles, templateData, 'getToolTemplatePath');
}


/**
 * This method is designed to be used on the "templateFiles" array in the main "resource.yml" file.
 * Each item in "templateFiles" contains a "src" property (which is relative to the  generator which
 * is calling this method), a "dest" property which is relative to the destination
 * path, and a flag indicating whether the file should overwrite existing files or not.
 *
 * @param {string[]} arrayOfTemplateFiles   An array of {src, dest, overwrite<boolean>} objects
 * @param {Object} templateData      Template data
 * @returns {undefined}
 * @this generator
 */
function copyGeneratorTemplates(arrayOfTemplateFiles, templateData) {
  copyTemplateFiles.call(this, arrayOfTemplateFiles, templateData, 'templatePath');
}


/**
 * Modify the path to make sure it is valid
 *
 * @param {string} pathStr    The path to evaluate
 * @param {string} promptKey  The name of the path (to display in any error messages)
 * @param {Object} defaultPaths An object containing the default paths to use when the path is invalid (except for paths.input.modulesSubDir, which may be blank)
 * @returns {string}          The filtered path, or an environment error
 * @this generator
 */
function filterPath(pathStr, promptKey, defaultPaths) {
  let newPath = pathStr;

  if (typeof pathStr !== 'string') {
    newPath = '';
  }

  if (path.isAbsolute(pathStr)) {
    return this.env.error('"' + promptKey + '" cannot be an absolute path: ' + pathStr);
  }

  if (pathStr.indexOf('..' + path.sep) !== -1) {
    this.env.error('"' + promptKey + '" cannot contain "..' + path.sep + '"');
  }

  newPath = _.trim(newPath);
  if (!newPath) {
    // Only the input.modulesSubDir may be blank, otherwise use the default value
    return promptKey === 'paths.input.modulesSubDir' ? newPath : _.get(defaultPaths, promptKey);
  }

  // remove the ./ at the start
  if (newPath.startsWith('.' + path.sep)) {
    newPath = newPath.substr(2);
  }

  // Replace any path separators with the Posix ones
  return path.posix.normalize(newPath + path.posix.sep);
}


/*
 * A path is valid if it's trimmed value is non-blank and does not start with . and is not absolute
 * @param path
 */
function validatePath(pathStr) {
  if (!(typeof pathStr === 'string' && _.trim(pathStr))) {
    return 'Path must not be blank';
  }
  if (pathStr.startsWith('.' + path.sep)) {
    return 'Path must not start with ".' + path.sep + '"';
  }
  if (pathStr.indexOf('..' + path.sep) !== -1) {
    return 'Path must not contain "..' + path.sep + '"';
  }

  if (path.isAbsolute(pathStr)) {
    return 'Absolute paths are not permitted';
  }

  return true;
}
