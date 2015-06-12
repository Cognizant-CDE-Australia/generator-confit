module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.verify');

  grunt.extendConfig({
    mpVerify: {
      all: config.tasks.allJS,
      src: config.tasks.srcJS,
      test: config.tasks.testJS,
      ci: config.tasks.allJSForCI,
      allNewer: config.tasks.allNewerJS
    },
    <% if (verify.jsLinter.indexOf('jscs')) { %>
    //jscs, check for code style errors
    jscs: {
      options: {
        config: '<%= verify.jsLintConfig.jscs.dest %>',
        reporter: 'text'
      },
      all: config.allFiles,
      src: config.srcFiles,
      test: config.testFiles,
      ci: {
        options: {
          config: config.jscs.CIConfig,
          reporter: 'junit',
          reporterOutput: config.reportDir + 'jscs.xml'
        },
        files: config.allFiles.files
      }
    },
    <% } %>
    jshint: {
      options: {
        jshintrc: config.jshint.baseConfig,
        reporter: require('jshint-stylish')
      },
      all: config.allFiles,
      src: config.srcFiles,
      test: {
        options: {
          jshintrc: config.jshint.testConfig
        },
        files: config.testFiles.files
      },
      ci: {
        options: {
          jshintrc: config.jshint.CIConfig,
          reporter: require('jshint-junit-reporter'),
          reporterOutput: config.reportDir + 'jshint.xml'
        },
        files: config.srcFiles.files
      }
    }
  });

  grunt.registerMultiTask('mpVerify', 'Verify Javascript syntax and style', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
