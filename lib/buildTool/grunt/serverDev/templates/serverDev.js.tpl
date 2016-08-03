module.exports = function (grunt) {
  'use strict';

  // We make this configuration lively so that we can change it at runtime (for testing purposes)
  var path = require('path');
  var yaml = require('js-yaml');
  var fs = require('fs');
  var confitConfig = yaml.load(fs.readFileSync(path.join(process.cwd(), 'confit.yml')))['generator-confit'];  // Try to keep the code lively! If confit.json changes, this code still works.


  var sslKey = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key').toString();
  var cert = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt').toString();

  grunt.extendConfig({
    connect: {
      dev: {
        options: {
          open: grunt.option('url') ? ? confitConfig.serverDev.protocol + '://' + confitConfig.serverDev.hostname + ':' + confitConfig.serverDev.port + '/' + grunt.option('url') : false,
          base: confitConfig.paths.output.devDir,
          port: grunt.option('port') || confitConfig.serverDev.port,
          hostname: confitConfig.serverDev.hostname,
          protocol: confitConfig.serverDev.protocol,
          livereload: 35729,
          keepalive: false
        }
      }
    },
    watch: {
      serverDev: {
        files: '<%= paths.output.devDir %>',
        options: {
          livereload: <% if(!serverDev.protocol === 'https') { %>true<% } else { %>{
            key: sslKey,
            cert: cert
          }<% } %>
        }
      }
    }
  });
};
