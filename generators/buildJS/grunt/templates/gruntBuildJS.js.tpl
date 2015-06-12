module.exports = function(grunt) {
  'use strict';

  /*
    Basic version of BuildJS just handles copying specific vendor scripts
    from bower directory into build directory
   */

  grunt.extendConfig({
    clean: {
      buildJS: ['<%= paths.output.devDir + paths.output.vendorJSSubDir %>', '<%= paths.output.devDir + paths.output.jsSubDir %>']
    },
    copy: {<% if(buildJS.vendorBowerScripts) { %>
      vendorJS: {
        files: [
          {
            expand: true,
            flatten: false,
            cwd: 'bower_components',
            src: [
              <%= buildJS.vendorBowerScripts.join(',\n              ') %>
            ],
            dest: '<%= paths.output.vendorJSSubDir %>'}
        ]
      },<% } %>
      moduleJS: {
        files: [
          {
            expand: true,
            flatten: false,
            src: [
              '<%= paths.input.modulesDir %>**/*.js',
              '!<%= paths.input.modulesDir %>**/*.spec.js'
            ],
            dest: '<%= paths.output.jsSubDir %>'
          }
        ]
      }
    },<%if(buildJS.lintJS) {%>
    <%=buildJS.lintJS%>: {
      options: {
        config: '../../.<%= buildJS.lintConfig %>'
      },
      src: ['src/**/*.js']
    },<% } %>
    watch: {
      buildJS: {
        files: ['**/*.js'],
        tasks: ['buildJS']
      }
    }
  });

  grunt.registerTask('buildJS', function() {
    grunt.task.run([
      'clean:buildJS',
      '<%= buildJS.lintJS %>',<% if (buildJS.vendorBowerScripts) { %>
      'copy:vendorJS',<% } %>
      'copy:moduleJS'
    ]);
  });
};
