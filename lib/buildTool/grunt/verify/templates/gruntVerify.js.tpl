module.exports = function (grunt) {
  'use strict';

  var path = require('path');
  var pathJoin = function(item) { return path.join(item); };

  grunt.extendConfig({
<%
  var lintTasks = [];

  var hasJSConfig = !!resources.buildJS && buildJS.sourceFormat;
  var jsExtensions = [];
  var jsFiles = [];

  if (hasJSConfig) {
    jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
    // Loop through extensions and generate jsFiles
    jsFiles = jsExtensions.map(ext => paths.input.srcDir + '**/*.' + ext).concat(jsExtensions.map(ext => paths.config.configDir + '**/*.' + ext));
  }
-%>
<% if (hasJSConfig && buildJS.sourceFormat === 'ES6') {
  lintTasks.push('eslint:all'); -%>
    eslint: {
      options: {
        configFile: path.join('<%= paths.config.configDir + resources.verify.configSubDir %>.eslintrc'),
        quiet: true // Report errors only
      },
      all: {
        src: <%- printJson(jsFiles, 10) %>.map(pathJoin)
      }
    },
<% } -%>
<% if (hasJSConfig && buildJS.sourceFormat === 'TypeScript') {
    lintTasks.push('tslint:all'); -%>
    tslint: {
      options: {
        configuration: path.join('<%= paths.config.configDir + resources.verify.configSubDir %>tslint.json')
      },
      all: {
        files: {
          src: <%- printJson(jsFiles, 10) %>.map(pathJoin)
        }
      }
    },
<% } -%>
<%
  var hasCSSConfig = !!resources.buildCSS && buildCSS.sourceFormat;
  var cssExtensions = [];
  var cssFiles = [];

  if (hasCSSConfig) {
    cssExtensions = resources.buildCSS.sourceFormat[buildCSS.sourceFormat].ext;
    cssFiles = cssExtensions.map(ext => paths.input.srcDir + '**/*.' + ext);
  }
%>
<% if (hasCSSConfig && buildCSS.sourceFormat === 'sass') {
    lintTasks.push('sasslint:all'); -%>
    sasslint: {
      options: {
        configFile: path.join('<%= paths.config.configDir + resources.verify.configSubDir %>.sasslintrc')
      },
      all: <%- printJson(cssFiles, 10) %>.map(pathJoin)
    },
<% } -%>
<% if (hasCSSConfig && buildCSS.sourceFormat === 'stylus') {
    lintTasks.push('stylint:all'); -%>
    stylint: {
      all: {
        options: {
          configFile: path.join('<%= paths.config.configDir + resources.verify.configSubDir %>.stylintrc')
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
