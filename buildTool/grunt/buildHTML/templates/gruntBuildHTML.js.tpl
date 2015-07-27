module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var util = require(path.resolve(__dirname + '/lib/utils.js'));

  grunt.extendConfig({
    copy: {
      html: {
        files: [
          {expand: true, flatten: false, cwd: '<%= paths.input.modulesDir %>', src: '<%= buildHTML.htmlFiles %>', dest: '<%= paths.output.devDir + paths.output.viewsSubDir %>'},
          {expand: true, flatten: true,  cwd: '<%= paths.input.srcDir %>', src: '*.html', dest: '<%= paths.output.devDir %>'}   // index.html is typically in /src
        ]
      },
      moduleAssets: {
        files: [
          {
            expand: true,
            flatten: false,
            cwd: '<%= paths.input.modulesDir %>',
            src: '<%= buildHTML.assetFiles %>',
            dest: '<%= paths.output.devDir + paths.output.assetsSubDir %>',
            rename: function (dest, src) {
              grunt.log.writeln('Copy: ' + src + ', ' + dest);
              // Remove the 'prefix/assets/ portion of the path
              var assetsDirName = '/<%= paths.input.assetsDir %>';
              var moduleName = src.substr(0, src.indexOf(assetsDirName));
              //grunt.log.ok('module name = ' + moduleName);
              var newPath = src.substr(src.indexOf(assetsDirName) + 8);
              return dest + '/' + moduleName + '/' + newPath;
            }
          }
        ]
      }
    },

    targethtml: {
      unoptimised: {
        files: [
          {src: '<%= paths.output.devDir %>*.html', dest: '<%= paths.output.devDir %>'}
        ]
      }
    },

    watch: {
      html: {
        files: [
          '<%= paths.input.modulesDir + buildHTML.htmlFiles %>',
          '<%= paths.input.srcDir %>*.html'
        ],
        tasks: ['copy:html', 'mpBuildHTMLUnoptimisedTags', 'targethtml:unoptimised']
      },
      moduleAssets: {
        files: ['<%= paths.input.modulesDir + buildHTML.assetFiles %>'],
        tasks: ['copy:moduleAssets']
      }
    }
  });


  function renderJSBundle(tagNamePrefix, tagName, srcSpec) {
    // Instead of reading the output directory, read the bundle description
    var fileSpec = {
      cwd: grunt.config('confit.paths.output.devDir'),
      src: srcSpec
    };
    var files = [];
    var htmlTagName = tagName.replace(/\./g, '_');  // Convert names containing '.' to '_'

    //grunt.log.ok('tagType = ' + tagNamePrefix);
    //grunt.log.ok('tagName = ' + htmlTagName);
    //grunt.log.ok('elementType = ' + elementType); // Can be 'script' or 'link'
    //grunt.log.ok('fileSpec = ' + JSON.stringify(fileSpec));

    if (fileSpec.cwd) {
      files = grunt.file.expand({cwd: fileSpec.cwd}, fileSpec.src);
    } else {
      files = grunt.file.expand(fileSpec.src || fileSpec);
    }
    grunt.log.ok('{{' + htmlTagName + '}}:\n' + files.join('\n'));

    grunt.config.set('targethtml.' + tagNamePrefix + '.options.curlyTags.' + htmlTagName, util.generateHTMLTags('script', files, ''));
  };


  function mpSetHTMLLinkTag(tagNamePrefix, tagName) {
    var fileSpec = {
      cwd: grunt.config('confit.paths.output.devDir'),
      src: grunt.config('confit.paths.output.cssSubDir') + '**/*.css'
    };
    var files = [];

    grunt.log.ok('fileSpec = ' + JSON.stringify(fileSpec));

    if (fileSpec.cwd) {
      files = grunt.file.expand({cwd: fileSpec.cwd}, fileSpec.src);
    } else {
      files = grunt.file.expand(fileSpec.src || fileSpec);
    }
    grunt.log.ok('{{' + tagName + '}}:\n' + files.join('\n'));

    grunt.config.set('targethtml.' + tagNamePrefix + '.options.curlyTags.' + tagName, util.generateHTMLTags('link', files, ''));
  };


  // This tasks creates the {{ }} tags for the 'targethtml' task to replace
  grunt.registerTask('renderUnoptimisedBundles', function() {
    // Generate config buy looking at the bundles
    mpSetHTMLLinkTag('unoptimised', 'cssFiles');

    var bundles = grunt.config('confit.buildJS.bundles');
    for (var i = 0; i < bundles.length; i++) {
      renderJSBundle('unoptimised', bundles[i].dest, bundles[i].src);
    }
  });

  grunt.registerTask('buildHTML', ['copy:html', 'copy:moduleAssets', 'renderUnoptimisedBundles', 'targethtml:unoptimised']);
};
