module.exports = function () {
  'use strict';

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt serverProd options');

    var config = this.getGlobalConfig();

    // Modify Package JSON
    this.setNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-connect': '*'
    });

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    this.fs.copyTpl(
      this.toolTemplatePath('serverProd.js.tpl'),
      this.destinationPath('config/grunt/serverProd.js'),
      config
    );


    this.defineNpmTask('serve:prod', ['grunt connect:prod'], 'Run a production server using grunt-connect on **' + config.serverProd.protocol + '://' + config.serverProd.hostname + ':' + config.serverProd.port + '**');
  }

  return {
    write: write
  };
};

