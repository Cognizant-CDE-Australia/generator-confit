module.exports = function() {
  'use strict';

  var _ = require('lodash');
  var gruntApp = require('./../app/app')();

  function write(gen) {
    gruntApp.write(gen); // Make sure we have a Gruntfile.js

    gen.log('Writing Grunt "serverDev" options');

    var config = gen.getConfig();

    // Modify Package JSON
    gen.setNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-connect': '*'
    });

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.toolTemplatePath('serverDev.js.tpl'),
      gen.destinationPath('config/grunt/serverDev.js'),
      config
    );


    gen.defineNpmTask('serve:dev', ['grunt connect:dev'], 'Runs a dev server using grunt-connect on **' + config.serverDev.protocol + '://' + config.serverDev.hostname + ':' + config.serverDev.port + '**');
  }

  return {
    write: write
  };
};

