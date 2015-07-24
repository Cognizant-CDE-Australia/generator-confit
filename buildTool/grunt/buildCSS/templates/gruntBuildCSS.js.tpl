'use strict';

module.exports = function(grunt) {

  grunt.extendConfig({
    // Add vendor prefixed styles
    <% if (buildCSS.autoprefixer) { %>
    autoprefixer: {
      options: {
        <% if (!buildCSS.includeOlderBrowsers) { %>
        browsers: ['last 2 versions']
        <% } else {%>
        browsers: ['last 2 versions', '<%= buildCSS.olderBrowsers %>']
        <% } %>
      },
      target: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.output.devDir %>css',
            src: '*.css',
            dest: '<%= paths.output.devDir %><%= paths.output.cssSubDir %>'
          }
        ]
      }
    },
    <% } %>
    <% if (buildCSS.externalCSS != 'none') { %>
    copy: {
      externalCSS: {
        files: [
          {
            expand: true,
            flatten: true,
            src:  ['<%= buildCSS.externalCSSFiles %>'],
            dest: '<%= paths.output.devDir %><%= paths.output.cssSubDir %>'
          }
        ]
      }
    },
    <% } %>
    <% if (buildCSS.cssCompiler === 'stylus') { %>
    stylus: {
      compile: {
        options: {
          compress: false
        },
        paths: '<%= paths.input.modulesDir %>**/<%= paths.input.stylesDir %>',  // Stylus-specific property
        files: [
          {
            expand: true,
            flatten: true,
            cwd: '<%= paths.input.modulesDir %>',
            src: ['**/<%= paths.input.stylesDir %><%= buildCSS.rootCSSFiles %>'],
            dest: '<%= paths.output.devDir %><%= paths.output.cssSubDir %>',
            ext: '.css'
          }
        ]
      }
    },
    <% } %>
    <% if (buildCSS.cssCompiler === 'sass') { %>
    sass: {
      compile: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: '<%= paths.input.modulesDir %>',
            src: ['**/<%= paths.input.stylesDir %><%= buildCSS.rootCSSFiles %>'],
            dest: '<%= paths.output.devDir %><%= paths.output.cssSubDir %>',
            ext: '.css'
          }
        ]
      }
    },
    <% } %>
    watch: {
      compileCss: {
        <% if (buildCSS.cssCompiler === 'stylus') { %>
        files: ['<%= paths.input.modulesDir %>**/<%= paths.input.stylesDir %>*.styl']
        <% } else if (buildCSS.cssCompiler === 'sass') { %>
        files: ['<%= paths.input.modulesDir %>**/<%= paths.input.stylesDir %>*.scss', '<%= paths.input.modulesDir %>**/<%= paths.input.stylesDir %>/*.sass']
        <% } else { %>
        files: ['<%= paths.input.modulesDir %>**/<%= paths.input.stylesDir %>*.css']
        <% } %>
      }
    }
  });

  grunt.registerTask('buildCSS', function() {
    grunt.task.run('<%= buildCSS.cssCompiler %>'<% if (buildCSS.autoprefixer) {%>, 'autoprefixer'<%}%>, 'copy:externalCSS');
  });
};
