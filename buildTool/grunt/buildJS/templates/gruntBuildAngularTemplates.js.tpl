module.exports = function(grunt) {
  'use strict';


  grunt.extendConfig({
    clean: {
      buildNgTemplate: ['<%= buildJS.tempJSDir %>']
    },
    copy: {
      ngTemplatesToTemp: {
        files: [
          {expand: true, flatten: false, cwd: '<%= paths.input.modulesDir %>', src: '<%= buildJS.templateHTMLFiles %>', dest: '<%= buildJS.tempTemplateDir %>'}
        ]
      },
      jsToTemp: {
        files: [
          {expand: true, flatten: false, cwd: '<%= paths.input.modulesDir %>', src: ['**/*.js', '!**/*spec.js', '!**/*e2e.js'], dest: '<%= buildJS.tempJSDir %>'}
        ]
      }
    },

    prepareNGTemplates: {
      app: {
         files: [
           {
             cwd: '<%= buildJS.tempTemplateDir %>',  // Using this shortens the URL-key of the template name in the $templateCache
             moduleName: '^(.*)\/<%= paths.input.templateDir %>',    // Use the captured group as the module name
             src: '<%= buildJS.templateHTMLFiles %>',   // The HTML template files
             dest: '<%= buildJS.tempJSDir %>'        // Base destination directory
           }
         ]
       }
    },

    ngtemplates: {
      options: {
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true, // Only if you don't use comment directives!
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      }//,
      // The prepareNGTemplate task generates the config for ngTemplates, using the module-folder hierarchy
      // See prepareNGTemplate config (above)
      //      'ui.accessible.controls.tooltip.template': {
      //        src: '<cfg.dest.partialsDir>**/ui/accessible/template/AccessibleTooltipTemplate.html',
      //        dest: '<cfg.dest.jsDir>ui/ui.accessible.controls.tooltip.template.js',
      //        options: {
      //          standalone: true
      //        }
      //      }
    },

    concurrent: {
      rebuildAndTest: ['buildJS', 'verify:allNewer', 'test:unit']
    },

    watch: {
      // JS task is in watch.js, as it needs to be run other tasks besides concat:moduleJS
      jsHtmlTemplates: {
        files: '<%= paths.input.modulesDir %><%= buildJS.templateHTMLFiles %>',
        tasks: ['buildJS']
      }
    }
  });


  grunt.registerMultiTask('prepareNGTemplates', 'Compile AngularJS templates for $templateCache', function () {
    // The module name should be unique, as the module generator will use: angular.module(name, []) to
    // CREATE the module (not reference an existing module)

    var moduleConfigs = {};

    // Iterate over all source files
    this.files.forEach(function (fileSet) {
      //grunt.log.writeln(fileSet.src);
      fileSet.src.forEach(function (srcFile) {
        var templatePath = srcFile.match(fileSet.moduleName)[1],
          moduleName = srcFile,
          templateName = templatePath;

        //grunt.log.writeln(srcFile);
        //grunt.log.writeln('Module name: ' + fileSet.moduleName);
        //grunt.log.writeln('templateName: ' + templatePath);
        //grunt.log.writeln('regex: ' + srcFile.match(fileSet.moduleName));
        //grunt.log.writeln('Dest path: ' + fileSet.dest + templateName + '/' + moduleName.replace(/\//g, '_') + '.js');

        //grunt.log.writeln('fs: ' + fileSet.dest);
        var newConfig = {
          cwd: fileSet.cwd,
          src: srcFile,
          dest: fileSet.dest + templateName + '/' + moduleName.replace(/\//g, '_') + '.js',
          options: {
            standalone: true
          }
        };
        moduleConfigs[srcFile] = newConfig;
      });
    });

    // Now apply the moduleConfigs to the ngtemplates config
    var ngConfig = grunt.config.get('ngtemplates');

    //grunt.log.writeln('MOD: ' + JSON.stringify(moduleConfigs, null, '\t'));

    for (var key in moduleConfigs) {
      if (!ngConfig[key]) {
        ngConfig[key] = moduleConfigs[key];
      }
    }
    //grunt.log.writeln('CONFIG: ' + JSON.stringify(ngConfig, null, '\t'));
    grunt.config.set('ngtemplates', ngConfig);
  });

  grunt.registerTask('buildAngularTemplates', [
    'clean:buildNgTemplate',
    'copy:ngTemplatesToTemp',
    'prepareNGTemplates',
    'ngtemplates',
    'copy:jsToTemp'
  ]);

};
