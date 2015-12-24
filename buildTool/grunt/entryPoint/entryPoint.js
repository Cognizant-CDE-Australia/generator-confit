'use strict';
var _ = require('lodash');


function isAngular1(frameworks) {
  return frameworks.indexOf('AngularJS 1.x') > -1;
}


function write(gen) {
  gen.log('Writing Grunt buildJS options');

  var config = gen.config.getAll();
  var buildJS = config.buildJS;


  if (buildJS.vendorBowerScripts) {
    /*
     Take buildJS.vendorBowerScripts, which looks like this:
     [
     {name:'jquery', scripts: ['bower_components/jquery/jquery.js']},
     {name:'bootstrap', scripts: ['bower_components/bootstrap/dist/bootstrap.js']}
     ];

     And map it across to this:
     [
     'jquery/jquery.js',
     'bootstrap/dist/bootstrap.js'
     ]
     */
    var bowerDir = 'bower_components/';
    buildJS.vendorBowerScripts = _.flatten(_.map(buildJS.vendorBowerScripts, function(packageObject) {
      return _.map(packageObject.scripts, function(scriptPath) {
        return scriptPath.substr(
            scriptPath.indexOf(bowerDir) + bowerDir.length,
            scriptPath.length);
      });
    }));
  }

  //// If we are building for Angular 1.x, convert the HTML Templates to JS files using ngtemplate
  //buildJS.isAngular1 = isAngular1(buildJS.framework);
  //
  //if (buildJS.isAngular1) {
  //  // If we are creating the scaffold project, create the bundle
  //  if (config.app.createScaffoldProject) {
  //    // Update the entryPoints to include the vendor files (normally a human would write the bundle-parameter)
  //    //gen.log(buildJS.vendorBowerScripts);
  //    var vendorFiles = (buildJS.vendorBowerScripts || []).map(function(val) {
  //      return config.paths.output.vendorJSSubDir + val;
  //    });
  //
  //    var entryPoint = config.entryPoint.entryPoints;
  //    entryPoint.app = [config.paths.output.jsSubDir + 'demoModule.js'];  // This file is generated at build-time by Grunt.
  //    entryPoint.vendor = vendorFiles;
  //
  //    //gen.log('Updating entryPoint config with vendor bundle: ', JSON.stringify(entryPoint));
  //    gen.setConfig({entryPoints: entryPoint});
  //  }
  //  //gen.log(config.entryPoint);
  //}
}


module.exports = function() {
    return {
    write: write
  };
};
