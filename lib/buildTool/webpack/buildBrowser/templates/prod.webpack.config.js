'use strict';

// START_CONFIT_GENERATED_CONTENT
let configOptions = {
  metaData: {
    title: 'Confit Sample Project',
    baseUrl: '/',
    ENV: process.env.ENV = process.env.NODE_ENV = 'production',
    jsSourceMap: 'source-map',
    cssSourceMap: false,
  },
  loaderOptions: {
    debug: false,
    minimize: true
  }
};
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
let config = require('./webpack.config.js').mergeConfig(configOptions);
// END_CONFIT_GENERATED_CONTENT

module.exports = config;
