'use strict';
var _ = require('lodash');


function isAngular1(frameworks) {
  return frameworks.indexOf('AngularJS 1.x') > -1;
}


function write(gen) {
  gen.log('Writing Grunt buildJS options');

  var config = gen.config.getAll(),
    buildJS = config.buildJS;

  gen.setNpmDevDependencies({
    'grunt-contrib-watch': '*',
    'grunt-contrib-clean': '*',
    'grunt-contrib-copy': '*',
    'grunt-contrib-concat': '*',
    'grunt-concurrent': '*'
  });


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
        return '"' + scriptPath.substr(
            scriptPath.indexOf(bowerDir) + bowerDir.length,
            scriptPath.length) + '"';
      });
    }));
  }

  // If we are not using ES6 modules, we must use include-replace (or maybe browserfy) to include static content
  // TODO: Ask a question about how you wish to include files

  // If we are building for Angular 1.x, convert the HTML Templates to JS files using ngtemplate
  buildJS.isAngular1 = isAngular1(buildJS.framework);

  gen.fs.copyTpl(
    gen.templatePath('../grunt/templates/gruntBuildJS.js.tpl'),
    gen.destinationPath('config/grunt/buildJS.js'),
    config
  );

  if (buildJS.isAngular1) {

    gen.setNpmDevDependencies({
      'grunt-angular-templates': '*'
    });

    buildJS.tempJSDir = '.tmp/js/'
    buildJS.tempTemplateDir = '.tmp/js/' + config.paths.input.moduleTemplates;
    buildJS.templateHTMLFiles = '**/' + config.paths.input.moduleTemplates + '*.html';

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuildAngularTemplates.js.tpl'),
      gen.destinationPath('config/grunt/buildAngularTemplates.js'),
      config
    );
  }
}

module.exports = function() {
    return {
    write: write
  };
};
