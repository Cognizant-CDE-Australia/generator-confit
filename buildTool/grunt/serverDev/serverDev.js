module.exports = function () {
  'use strict';

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt serverDev options');

    var config = this.getConfig();

    // Modify Package JSON
    this.setNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-connect': '*'
    });

    // this.rate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    this.fs.copyTpl(
      this.toolTemplatePath('serverDev.js.tpl'),
      this.destinationPath('config/grunt/serverDev.js'),
      config
    );


    this.defineNpmTask('serve:dev', ['grunt connect:dev'], 'Runs a dev server using grunt-connect on **' + config.serverDev.protocol + '://' + config.serverDev.hostname + ':' + config.serverDev.port + '**');
  }

  return {
    write: write
  };
};

