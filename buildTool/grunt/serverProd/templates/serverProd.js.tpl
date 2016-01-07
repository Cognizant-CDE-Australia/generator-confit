module.exports = function(grunt) {
  'use strict';

  var sslKey = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key').toString();
  var cert = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt').toString();

  grunt.extendConfig({
    connect: {
      prod: {
        options: {
          open: grunt.option('url') ? '<%= serverProd.protocol %>://<%= serverProd.hostname %>:<%= serverProd.port %>/' + grunt.option('url') : false,
          base: '<%= serverProd.baseDir %>',
          port: '<%= serverProd.port %>',
          hostname: '<%= serverProd.hostname %>',
          protocol: '<%= serverProd.protocol %>',
          livereload: 35729,
          keepalive: true
        }
      }
    },
    watch: {
      serverProd: {
        files: '<%= serverProd.baseDir %>',
        options: {
          livereload: <% if(!serverProd.protocol === 'https') { %>true<% } else { %>{
            key: sslKey,
            cert: cert
          }<% } %>
        }
      }
    }
  });
};
