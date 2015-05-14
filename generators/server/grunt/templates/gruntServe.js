module.exports = function(grunt) {
  'use strict';

  var config = grunt.config.get('modularProject.serve');
  var compression = require('compression');

  grunt.extendConfig({
    serve: {
      //dev: ['connect:dev'],
      //prod: ['connect:prod']
    },
    // The actual grunt serve settings
    connect: {
      // Configs go here
    }
  });

  grunt.registerMultiTask('serve', 'Start a webserver and serve files', function () {
    grunt.log.writeln(this.target + ': ' + this.data);

    // Execute each task
    grunt.task.run(this.data);
  });
};
