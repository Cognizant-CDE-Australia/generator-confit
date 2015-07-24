module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.verify');

  <%
  // Common file config for verify
  verifyFileConfig = "" +
    "all: {\n" +
    "        files: [{expand: true, cwd: '" + paths.input.modulesDir + "', src: ['**/*.js']}]\n" +
    "      },\n" +
    "      src: {\n" +
    "        files: [{expand: true, cwd: '" + paths.input.modulesDir + "', src: ['**/*.js', '!**/*.spec.js']}]\n" +
    "      },\n" +
    "      test: {\n" +
    "        files: [{expand: true, cwd: '" + paths.input.modulesDir + "', src: ['**/*.spec.js']}]\n" +
    "      }";
  %>


  grunt.extendConfig({
    <% if (verify.jsLinter.indexOf('jscs') > -1) { %>
    //jscs, check for code style errors
    jscs: {
      options: {
        config: '<%= verify.jsLintConfig.jscs.dest %>',
        reporter: 'text'
      },
      <%= verifyFileConfig %>
    },
    <% } %>
    <% if (verify.jsLinter.indexOf('jshint') > -1) { %>
    jshint: {
      options: {
        jshintrc: '<%= verify.jsLintConfig.jshint.dest %>',
        reporter: require('jshint-stylish')
      },
      <%= verifyFileConfig %>
    },
    <% } %>
    <% if (verify.jsLinter.indexOf('eslint') > -1) { %>
    eslint: {
      options: {
        config: '<%= verify.jsLintConfig.eslint.dest %>'
      },
      <%= verifyFileConfig %>
    },
    <% } %>
    verify: {
      all: [<%= verify.jsLinter.map(function(val) { return '\'' + val + ':all\''; }) %>],
      src: [<%= verify.jsLinter.map(function(val) { return '\'' + val + ':src\''; }) %>],
      test: [<%= verify.jsLinter.map(function(val) { return '\'' + val + ':test\''; }) %>],
      allNewer: [<%= verify.jsLinter.map(function(val) { return '\'newer:' + val + ':all\''; }) %>]
    }
  });

  grunt.registerMultiTask('verify', 'Verify JavaScript syntax and style', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
