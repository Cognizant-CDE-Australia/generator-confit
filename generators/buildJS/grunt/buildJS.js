'use strict';
var _ = require('lodash');

module.exports = function() {
  var lintOptions = {
    jshint: {
      dependency: {'grunt-contrib-jshint': '*'},
      config: 'jshintrc'
    },
    eslint: {
      dependency: {'gruntify-eslint': '*'},
      config: 'eslintrc'
    }
  };

  function copyLintDependencies(lintJS, gen) {
    gen.addNpmDevDependencies(lintJS.dependency);

    gen.fs.copy(
      gen.templatePath(lintJS.config),
      gen.destinationPath('.' + lintJS.config)
    );
  }

  function write(gen) {
    gen.log('Writing grunt buildJS options');

    var config = gen.config.getAll(),
        buildJS = config.buildJS;

    gen.addNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-clean': '*',
      'grunt-contrib-copy': '*'
    });

    if (buildJS.lintJS) {
      copyLintDependencies(lintOptions[buildJS.lintJS], gen);
    }

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

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuildJS.tpl'),
      gen.destinationPath('config/grunt/buildJS.js'),
      config
    );
  }


  return {
    write: write
  };
};
