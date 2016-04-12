module.exports = function (grunt) {
  'use strict';

  grunt.extendConfig({
<%
  var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
  var cssExtensions = resources.buildCSS.sourceFormat[buildCSS.sourceFormat].ext;

  // Loop through extensions and generate jsFiles and cssFiles
  var jsFiles = jsExtensions.map(ext => paths.input.srcDir + '**/*.' + ext).concat(jsExtensions.map(ext => paths.config.configDir + '**/*.' + ext));

  // Ignore the sampleApp.demoModuleDir directory
  jsFiles.push('!' + paths.input.modulesDir + '**/' + resources.sampleApp.demoModuleDir);
  var cssFiles = cssExtensions.map(ext => paths.input.srcDir + '**/*.' + ext);

  var lintTasks = [];
-%>
<% if (buildJS.sourceFormat === 'ES5' || buildJS.sourceFormat === 'ES6') {
  lintTasks.push('eslint:all'); -%>
    eslint: {
      options: {
        configFile: '<%= paths.config.configDir %>verify/.eslintrc',
        quiet: true // Report errors only
      },
      all: {
        src: <%- printJson(jsFiles, 10) %>
      }
    },
<% } -%>
<% if (buildJS.sourceFormat === 'TypeScript') {
    lintTasks.push('tslint:all'); -%>
    tslint: {
      options: {
        configuration: '<%= paths.config.configDir %>verify/tslint.json'
      },
      all: {
        files: {
          src: <%- printJson(jsFiles, 10) %>
        }
      }
    },
<% } -%>
<% if (buildCSS.sourceFormat === 'sass') {
    lintTasks.push('sasslint:all'); -%>
    sasslint: {
      options: {
        configFile: '<%= paths.config.configDir %>verify/.sasslintrc'
      },
      all: <%- printJson(cssFiles, 10) %>
    },
<% } -%>
<% if (buildCSS.sourceFormat === 'stylus') {
    lintTasks.push('stylint:all'); -%>
    stylint: {
      all: {
        options: {
          configFile: '<%= paths.config.configDir %>verify/.stylintrc'
        },
        src: <%- printJson(cssFiles, 10) %>
      }
    },
<% } -%>
    watch: {
      verify: {
        options: {
          spawn: true
        },
        files: <%- printJson(jsFiles.concat(cssFiles), 10) %>,
        tasks: <%- printJson(lintTasks.map(function(task) { return 'newer:' + task; }), 10) %>
      }
    }
  });

  grunt.registerTask('verify', 'Run all the verify tasks', <%- printJson(lintTasks) %>);
};
