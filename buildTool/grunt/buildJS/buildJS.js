'use strict';
var _ = require('lodash');


function isAngular1(frameworks) {
  return frameworks.indexOf('AngularJS 1.x') > -1;
}


function write(gen) {
  gen.log('Writing Grunt buildJS options');

  var config = gen.config.getAll();
  var buildJS = config.buildJS;

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
        return scriptPath.substr(
            scriptPath.indexOf(bowerDir) + bowerDir.length,
            scriptPath.length);
      });
    }));
  }

  // If we are not using ES6 modules, we must use include-replace (or maybe browserfy) to include static content
  // TODO: Ask a question about how you wish to include files

  // If we are building for Angular 1.x, convert the HTML Templates to JS files using ngtemplate
  buildJS.isAngular1 = isAngular1(buildJS.framework);

  gen.fs.copyTpl(
    gen.toolTemplatePath('gruntBuildJS.js.tpl'),
    gen.destinationPath('config/grunt/buildJS.js'),
    config
  );

  if (buildJS.isAngular1) {
    gen.setNpmDevDependencies({
      'grunt-angular-templates': '*'
    });

    // Set some temporary variables
    buildJS.tempJSDir = '.tmp/js/';
    buildJS.tempTemplateDir = '.tmp/' + config.paths.input.templateDir;

    buildJS.templateHTMLFiles = '**/' + config.paths.input.templateDir + '*.html';

    // If we are creating the scaffold project, create the bundle
    if (config.app.createScaffoldProject) {
      // Update the scaffold-bundle to include the vendor files (normally a human would write the bundle-parameter)
      //gen.log(buildJS.vendorBowerScripts);
      var vendorFiles = (buildJS.vendorBowerScripts || []).map(function(val) {
        return config.paths.output.vendorJSSubDir + val;
      });

      buildJS.bundles = [
        {
          src: vendorFiles.concat(['js/demoModule.js']),
          dest: 'app.js'
        }
      ];
      gen.log('Updating buildJS config with scaffold bundle: ', buildJS.bundles);
      var updatedConfig = gen.getConfig();
      updatedConfig.bundles = buildJS.bundles;
      gen.setConfig(updatedConfig);
    }

    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntBuildAngularTemplates.js.tpl'),
      gen.destinationPath('config/grunt/buildAngularTemplates.js'),
      config
    );
  }

  //
  buildExample(gen, buildJS);
}


function buildExample(gen, buildJS) {
  if (!gen.getGlobalConfig().app.createScaffoldProject) {
    return;
  }

  var paths = gen.getGlobalConfig().paths;

  if (buildJS.isAngular1) {
    gen.fs.copy(gen.toolTemplatePath('src/indexAngular1.html'), paths.input.srcDir + 'index.html');
    gen.fs.copy(gen.toolTemplatePath('src/modules/demoAngular1Module/_myApp.js'), paths.input.modulesDir + gen.demoOutputModuleDir + '_myApp.js');
    gen.fs.copy(gen.toolTemplatePath('src/modules/demoAngular1Module/myComponent.js'), paths.input.modulesDir + gen.demoOutputModuleDir + 'myComponent.js');
    gen.fs.copy(gen.toolTemplatePath('src/modules/demoAngular1Module/template/myComponentTemplate.html'), paths.input.modulesDir + gen.demoOutputModuleDir + paths.input.templateDir + 'myComponentTemplate.html');
  }
}



module.exports = function() {
    return {
    write: write
  };
};
