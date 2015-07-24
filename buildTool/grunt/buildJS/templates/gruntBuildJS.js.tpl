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
      }<% } %>
    },
    concat: {
      moduleJS: {
        files: [
          {
            expand: true,
            <% if (buildJS.isAngular1) {%>
            cwd: '.tmp/js/',  // This should be the src/modules/js dir, unless we are using Angular templates OR include-replace
            <% } else { %>
            cwd: '<%= paths.input.modulesDir %>',
            <% } %>
            src: ['**/_*.js', '**/*.js', '!**/*.spec.js', '!**/*.e2e.js'], // Concat files starting with '_' first, ignore test specs
            dest: '<%= paths.output.devDir + paths.output.jsSubDir %>',
            rename: function (dest, src) {
              // Use the source directory(s) to create the destination file name
              // e.g. ui/common/icon.js -> ui/common.js
              //      ui/special/foo.js -> ui/special.js
              //grunt.log.writeln('Concat: ' + src);
              //grunt.log.writeln('------->: ' + src.substring(0, src.lastIndexOf('/')));

              return dest + src.substring(0, src.lastIndexOf('/')) + '.js';
            }
          }
        ]
      }
    },
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
      <% if (buildJS.vendorBowerScripts) { %>'copy:vendorJS',<% } %>
      <% if (buildJS.isAngular1) { %>'buildAngularTemplates',<% } %>
      'concat:moduleJS'
    ]);
  });
};
