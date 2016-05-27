module.exports = function (grunt) {
  'use strict';

  var path = require('path');
  var pathJoin = function(item) { return path.join(item); };

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
        configFile: path.join('<%= paths.config.configDir %>verify/.eslintrc'),
        quiet: true // Report errors only
      },
      all: {
        src: <%- printJson(jsFiles, 10) %>.map(pathJoin)
      }
    },
<% } -%>
<% if (buildJS.sourceFormat === 'TypeScript') {
    lintTasks.push('tslint:all'); -%>
    tslint: {
      options: {
        configuration: path.join('<%= paths.config.configDir %>verify/tslint.json')
      },
      all: {
        files: {
          src: <%- printJson(jsFiles, 10) %>.map(pathJoin)
        }
      }
    },
<% } -%>
<% if (buildCSS.sourceFormat === 'sass') {
    lintTasks.push('sasslint:all'); -%>
    sasslint: {
      options: {
        configFile: path.join('<%= paths.config.configDir %>verify/.sasslintrc')
      },
      all: <%- printJson(cssFiles, 10) %>.map(pathJoin)
    },
<% } -%>
<% if (buildCSS.sourceFormat === 'stylus') {
    lintTasks.push('stylint:all'); -%>
    stylint: {
      all: {
        options: {
          configFile: path.join('<%= paths.config.configDir %>verify/.stylintrc')
        },
        src: <%- printJson(cssFiles, 10) %>.map(pathJoin)
      }
    },
<% } -%>
    watch: {
      verify: {
        options: {
          spawn: true
        },
        files: <%- printJson(jsFiles.concat(cssFiles), 10) %>.map(pathJoin),
        tasks: <%- printJson(lintTasks.map(function(task) { return 'newer:' + task; }), 10) %>
      }
    }
  });

  grunt.registerTask('verify', 'Run all the verify tasks', <%- printJson(lintTasks, 4) %>);
};
