const fs = require('fs');
const path = require('path');

/**
 * ensure that the directory exists and create folders if nessecary
 * @param {string} filePath file path string
 */
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

/**
 * write a string into a file at the defined path
 * @param {string} filePath path to write file to
 * @param {string} contents string to write into file
 */
function writeFile(filePath, contents) {
  ensureDirectoryExistence(filePath);

  fs.writeFile(filePath, contents, function(err) {
    if(err) {
        return console.log(err);
    }
  });
}

module.exports = {
  writeFile
};
