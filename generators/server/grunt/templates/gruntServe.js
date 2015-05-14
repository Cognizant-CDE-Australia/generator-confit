module.exports = function(grunt) {
  'use strict';

  <% var ssl = (protocol === 'https'); %>

  <% if(ssl) { %>
  var sslKey = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key').toString(),
      cert = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt').toString();
  <% } %>

  grunt.extendConfig({
    serve: {
      '<%= serverName %>': ['connect:<%= serverName %>']
    },
    // The actual grunt serve settings
    connect: {
      '<%= serverName %>': {
        options: {
          open: true,
          base: '<%= baseDir %>',
          port: '<%= port %>',
          hostname: '<%= hostname %>',
          protocol: '<%= protocol %>',
          livereload: 35729,
          keepalive: true
        }
      }
    },
    watch: {
      '<%= serverName %>': {
        files: '<%= baseDir %>',
        options: {
          livereload: <% if(!ssl) { %> true <% } else { %>{
            key: sslKey,
            cert: cert
          }<% } %>
        }
      }
    }
  });

  grunt.registerMultiTask('serve', 'Start a webserver and serve files', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
