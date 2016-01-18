module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
<% if (verify.linters.indexOf('eslint') > -1) { -%>
    eslint: {
      options: {
        configFile: '<%= paths.config.configDir %>verify/.eslintrc'
      },
      all: {
        src: ['<%= paths.input.srcDir %>**/*.js', '<%= paths.config.configDir %>**/*.js']
      }
    },
<% } -%>
<% if (verify.linters.indexOf('sasslint') > -1) { -%>
    sasslint: {
      options: {
        configFile: '<%= paths.config.configDir %>verify/.sasslintrc'
      },
      all: ['<%= paths.input.srcDir %>**/*.s+(a|c)ss']
    },
<% } -%>
<% if (verify.linters.indexOf('stylint') > -1) { -%>
    stylint: {
      all: {
        options: {
          configFile: '<%= paths.config.configDir %>verify/.stylintrc'
        },
        src: ['<%= paths.input.srcDir %>**/*.styl']
      }
    },
<% } -%>
    watch: {
      verify: {
        options: {
          spawn: true
        },
        files: [<%- verify.linters.map(function(linter) {
          if (linter === 'sasslint')
            return '\'<' + '%= ' + linter + '.all %' + '>\'';
          else
            return '\'<' + '%= ' + linter + '.all.src %' + '>\'';
          }).join(', ');%>],
        tasks: [<%- verify.linters.map(function(linter) {return '\'newer:' + linter + ':all\'';}).join(', '); %>]
      }
    }
  });

  grunt.registerTask('verify', 'Run all the verify tasks', [<%- verify.linters.map(function(linter) {return '\'' + linter + ':all\'';}).join(', '); %>]);
};
