'use strict';
module.exports = function(grunt) {

// START_CONFIT_GENERATED_CONTENT
  var path = require('path');

  // Time how long tasks take. Can help when optimizing build times
  require('load-grunt-tasks')(grunt);

  // Load additional tasks
  grunt.loadTasks(path.join('<%= paths.config.configDir %>grunt'));
// END_CONFIT_GENERATED_CONTENT

};
