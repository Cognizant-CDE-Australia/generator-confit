'use strict';
module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('load-grunt-tasks')(grunt);

  // Load additional tasks
  grunt.loadTasks('config/grunt');
};
