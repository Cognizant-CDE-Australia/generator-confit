module.exports = function(grunt) {
  'use strict';

  grunt.extendConfig({
<% if (verify.jsLinter.indexOf('jscs') > -1) { -%>
    //jscs, check for code style errors
    jscs: {
      options: {
        config: '<%= paths.config.configDir %>verify/.jscsrc',
        reporter: 'text'
      },
      all: {
        src: ['<%= paths.input.srcDir %>**/*.js', '<%= paths.config.configDir %>**/*.js']
      }
    },
<% } -%>
<% if (verify.jsLinter.indexOf('jshint') > -1) { -%>
    jshint: {
      options: {
        jshintrc: '<%= paths.config.configDir %>verify/.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: ['<%= paths.input.srcDir %>**/*.js', '<%= paths.config.configDir %>**/*.js']
      }
    },
<% } -%>
<% if (verify.jsLinter.indexOf('eslint') > -1) { -%>
    eslint: {
      options: {
        configFile: '<%= paths.config.configDir %>verify/.eslintrc'
      },
      all: {
        src: ['<%= paths.input.srcDir %>**/*.js', '<%= paths.config.configDir %>**/*.js']
      }
    },
<% } -%>
<% if (buildCSS.cssCompiler.indexOf('sass') > -1) { -%>
    sasslint: {
      options: {
        configFile: '<%= paths.config.configDir %>verify/.sassrc'
      },
      all: ['<%= paths.input.srcDir %>**/*.s+(a|c)ss']
    },
<% } -%>
<% if (buildCSS.cssCompiler.indexOf('stylus') > -1) { -%>
    stylint: {
      all: {
        options: {
          configFile: '<%= paths.config.configDir %>verify/.stylusrc'
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
        files: [<%- verify.allLinters.map(function(linter) {
          if (linter === 'sasslint')
            return '\'<' + '%= ' + linter + '.all %' + '>\'';
          else
            return '\'<' + '%= ' + linter + '.all.src %' + '>\'';
          }).join(', ');%>],
        tasks: [<%- verify.allLinters.map(function(linter) {return '\'newer:' + linter + ':all\'';}).join(', '); %>]
      }
    }
  });

  grunt.registerTask('verify', 'Run all the verify tasks', [<%- verify.allLinters.map(function(linter) {return '\'' + linter + ':all\'';}).join(', '); %>]);
};
