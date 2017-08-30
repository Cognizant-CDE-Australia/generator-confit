const fs = require('fs');

/**
 * Check if the file exists
 * @param {string} fp File Path
 * @returns {boolean} result
 */
function fileExists(fp) {
  try {
    fs.accessSync(fp);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  fileExists
};
