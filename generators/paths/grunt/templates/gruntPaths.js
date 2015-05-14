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
        moduleIncludes: '<%= input.includesDir %>',
        modulePartials: '<%= input.viewsDir %>',
        moduleStyles: '<%= input.stylesDir %>',
        moduleTemplates: '<%= input.templateDir %>',
        moduleUnitTest: '<%= input.unitTestDir %>',
        moduleE2ETest: '<%= input.e2eTestDir %>'
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
