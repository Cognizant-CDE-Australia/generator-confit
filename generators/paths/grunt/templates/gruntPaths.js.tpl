'use strict';
module.exports = function(grunt) {

  // BU: Adding the confit config to Grunt allows us to us avoid regenerating using 'yo confit'.
  // But is this what we want? Is it better to force users to change confit.json then run 'yo confit' afterwards?
  grunt.extendConfig({
    confit: grunt.file.readJSON('confit.json')['generator-confit']
  });
};
