module.exports = function() {
  'use strict';

  var _ = require('lodash');
  var gruntApp = require('./../app/app')();

  function write(gen) {
    gruntApp.write(gen); // Make sure we have a Gruntfile.js

    gen.log('Writing Grunt "serverProd" options');

    var config = gen.getGlobalConfig();

    // Modify Package JSON
    gen.setNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-connect': '*'
    });

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.toolTemplatePath('serverProd.js.tpl'),
      gen.destinationPath('config/grunt/serverProd.js'),
      config
    );


    gen.defineNpmTask('serve:prod', ['grunt connect:prod'], 'Runs a production server using grunt-connect on **' + config.serverProd.protocol + '://' + config.serverProd.hostname + ':' + config.serverProd.port + '**');
  }

  return {
    write: write
  };
};

