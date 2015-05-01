'use strict';
module.exports = function(grunt) {

  grunt.extendConfig({
    project: {
      config: {
        dir: 'config/',
        gruntFiles: ['Gruntfile.js']
      },

      input: {
        srcDir: '<%= input.srcDir %>',
        modulesDir: '<%= input.modulesDir %>',
        moduleAssets: '<%= input.assetsDir %>',
        moduleIncludes: 'includes',
        modulePartials: 'views',
        moduleStyles: 'styles',
        moduleTemplates: 'template',
        moduleUnitTest: 'unitTest',
        moduleE2ETest: 'e2eTest'
      },
      output: {
        devDir: 'dev/',
        prodDir: 'build/static/',
        assetsSubDir: 'assets/',
        cssSubDir: 'css/',
        jsSubDir: 'js/',
        vendorJSSubDir: 'vendor/',
        viewsSubDir: 'views/',
        reportDir: 'bin/'
      }
    }
  });
};
