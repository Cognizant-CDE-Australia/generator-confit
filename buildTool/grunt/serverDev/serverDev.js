module.exports = function () {
  'use strict';

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt serverDev options');

    var config = this.getConfig();

    this.fs.copyTpl(
      this.toolTemplatePath('serverDev.js.tpl'),
      this.destinationPath('config/grunt/serverDev.js'),
      config
    );

    this.defineNpmTask('serve:dev', ['grunt connect:dev'], 'Runs a dev server using grunt-connect on **' + config.serverDev.protocol + '://' + config.serverDev.hostname + ':' + config.serverDev.port + '**');

    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().serverDev.packages);
  }

  return {
    write: write
  };
};

