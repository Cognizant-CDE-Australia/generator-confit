module.exports = function(grunt) {
  'use strict';

  grunt.extendConfig({
    clean: {
      devDir: '<%= paths.output.devDir %>'
    },

    watch: {
      // Watch the Grunt config files - if they change, rebuild
      gruntConfig: {
        files: ['Gruntfile.js', '<%= paths.config.configDir %>grunt/**/*.js'],
        tasks: ['devBuild']
      },
      // Watch the output files
      dev: {
        files: '<%= paths.output.devDir %>**/*',
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('devBuild', 'PRIVATE - do not use', ['clean:devDir', /*'buildIncludes',*/ 'buildJS', 'buildCSS', 'buildHTML'/*, 'verify:all'*/]);

  grunt.registerTask('optimisedBuild', 'PRIVATE - do not use. Create an optimised build', function() {
    var tasks = ['devBuild', 'test:unit'].concat('<%= '' /*optimise.buildTasks*/ %>');
    grunt.log.writeln('optimisedBuild: ' + tasks);
    grunt.task.run(tasks);
  });

  grunt.registerTask('devBuildWatch', 'PRIVATE - do not use. Create an UN-optimised build & watch it.', ['devBuild', 'serve:dev', 'watch']);

// TOP-LEVEL TASKS
  // There are only 2 kinds of builds - development and production (optimized).
  // Unit tests run against development source code (unminified, but concatenated)

  grunt.registerTask('dev', 'Create a dev build then watch for changes', ['devBuildWatch']);

  grunt.registerTask('build', 'Create a release build', function(target) {
    if (target === 'serve') {
      grunt.task.run(['optimisedBuild', 'serve:prod']);
    } else {
      grunt.task.run(['optimisedBuild']);
    }
  });

}
