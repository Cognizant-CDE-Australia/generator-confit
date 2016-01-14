module.exports = function (grunt) {
  'use strict';

  var sslKey = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key').toString();
  var cert = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt').toString();

  grunt.extendConfig({
    connect: {
      dev: {
        options: {
          open: grunt.option('url') ? '<%= serverDev.protocol %>://<%= serverDev.hostname %>:<%= serverDev.port %>/' + grunt.option('url') : false,
          base: '<%= paths.output.devDir %>',
          port: '<%= serverDev.port %>',
          hostname: '<%= serverDev.hostname %>',
          protocol: '<%= serverDev.protocol %>',
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
