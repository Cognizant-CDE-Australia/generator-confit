'use strict';
module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-extend-config');


  // Load additional tasks
  grunt.loadTasks('config/grunt');
};
