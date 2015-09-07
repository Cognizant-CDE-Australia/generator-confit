'use strict';

var _ = require('lodash');
var webpackConfigurator = require('../webpackConfigurator');

module.exports = function() {

  function write(gen) {
    gen.log('Generate webpack config');

    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    var webpackConfig = {};
    _.assign(webpackConfig, {webpack: webpackConfigurator.getConfig()}, config);

    gen.fs.copyTpl(
      gen.toolTemplatePath('webpack.config.js.tpl'),
      gen.destinationPath(outputDir + 'webpack/webpack.config.js'),
      webpackConfig
    );
  }


  return {
    write: write
  };
};
