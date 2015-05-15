module.exports = function(grunt) {
  'use strict';

  var sslKey = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.key').toString(),
      cert = grunt.file.read('node_modules/grunt-contrib-connect/tasks/certs/server.crt').toString();

  grunt.extendConfig({
    serve: {
    <% for (var i = 0; i < servers.length; i++) { %>
      '<%= servers[i].name %>': ['connect:<%= servers[i].name %>']<% if (i < servers.length - 1) { %>,<% } %>
    <% } %>
    },
    // The actual grunt serve settings
    connect: {
      <% for (var i = 0; i < servers.length; i++) { %>
        <% if (i !== '_version') { %>
      '<%= servers[i].name %>': {
        options: {
          open: true,
          base: '<%= servers[i].baseDir %>',
          port: '<%= servers[i].port %>',
          hostname: '<%= servers[i].hostname %>',
          protocol: '<%= servers[i].protocol %>',
          livereload: 35729,
          keepalive: true
        }
      }<% if (i < servers.length - 1) { %>,<% } %>
        <% } %>
      <% } %>
    },
    watch: {
      <% for (var i = 0; i < servers.length; i++) { %>
      '<%= servers[i].name %>': {
        files: '<%= servers[i].baseDir %>',
        options: {
          livereload: <% if(!servers[i].protocol === 'https') { %>true<% } else { %>{
            key: sslKey,
            cert: cert
          }<% } %>
        }
      }<% if (i < servers.length - 1) { %>,<% } %>
      <% } %>
    }
  });

  grunt.registerMultiTask('serve', 'Start a webserver and serve files', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
