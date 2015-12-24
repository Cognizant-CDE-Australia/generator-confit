'use strict';

var _ = require('lodash');

module.exports = function(config, confitConfig) {
  var projectPaths = confitConfig.paths;
  var basePath = process.cwd() + '/';

  var newConfig = {
    context: basePath + projectPaths.input.srcDir.substr(0, projectPaths.input.srcDir.length - 1),   // The baseDir for resolving the Entry option
    entry: confitConfig.entryPoint.entryPoints
  };

  return _.merge(config, newConfig);
};
