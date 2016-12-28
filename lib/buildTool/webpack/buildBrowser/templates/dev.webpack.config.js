'use strict';

// START_CONFIT_GENERATED_CONTENT
let configOptions = {
  metaData: {
    title: 'Confit Sample Project',
    baseUrl: '/',
    ENV: process.env.ENV = process.env.NODE_ENV = 'development',
    jsSourceMap: 'cheap-module-source-map',
    cssSourceMap: false,
  },
  loaderOptions: {
    debug: true
  }
};
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
let config = require('./webpack.config.js').mergeConfig(configOptions);
config.node.process = true;   // Not sure why we do this for development?
// END_CONFIT_GENERATED_CONTENT

module.exports = config;
