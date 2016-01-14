module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
    connect: {
      prod: {
        options: {
          open: grunt.option('url') ? '<%= serverProd.protocol %>://<%= serverProd.hostname %>:<%= serverProd.port %>/' + grunt.option('url') : false,
          base: '<%= paths.output.prodDir %>',
          port: '<%= serverProd.port %>',
          hostname: '<%= serverProd.hostname %>',
          protocol: '<%= serverProd.protocol %>',
          keepalive: true
        }
      }
    }
  });
};
