module.exports = function (grunt) {
  'use strict';

  // We make this configuration lively so that we can change it at runtime (for testing purposes)
  var path = require('path');
  var yaml = require('js-yaml');
  var fs = require('fs');
  var confitConfig = yaml.load(fs.readFileSync(path.join(process.cwd(), 'confit.yml')))['generator-confit'];  // Try to keep the code lively! If confit.json changes, this code still works.


  grunt.extendConfig({
    connect: {
      prod: {
        options: {
          open: grunt.option('url') ? confitConfig.serverProd.protocol + '://' + confitConfig.serverProd.hostname + ':' + confitConfig.serverProd.port + '/' + grunt.option('url') : false,
          base: confitConfig.paths.output.prodDir,
          port: grunt.option('port') || confitConfig.serverProd.port,
          hostname: confitConfig.serverProd.hostname,
          protocol: confitConfig.serverProd.protocol,
          keepalive: true
        }
      }
    }
  });
};
