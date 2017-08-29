const path = require('path');
const findup = require('findup-sync');

/**
 * @param {string} pathString input path string
 * @returns {string} PathString path string relative to the root folder resolved with provided parameters
 */

const root = path.join.bind(path, path.join(findup('.git', {cwd: __dirname}), '/..'));

/**
 * Returns a function which accepts a path and makes it relative to the root directory
 * @param {string} dirName - Usually the __dirname variable
 */
const relativeRoot = (dirName) => (relRootPath) => path.join(dirName.replace(root(), '').replace(/(\/[^\/]+)/g, '../'), relRootPath) ;


module.exports = {
  root,
  relativeRoot
};
