'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');
var _ = require('lodash');


module.exports = confitGen.create({

  configuring: function() {
    this.buildTool.configure.apply(this);
  },

  writing: function() {
    this.buildTool.write.apply(this);

    var config = this.getGlobalConfig();
    var paths = config.paths;

    // Global task-wiring, independent of any particular tool (although there is some knowledge that the child-tasks MUST exist, and how they should be run together).
    this.defineNpmTask('start', ['npm run dev'], 'Alias for `npm run dev` task');
    this.defineNpmTask('dev', ['clean:dev', 'verify', '--parallel verify:watch build:dev serve:dev'], 'Run project in development mode (verify code, create dev build into ' + paths.output.devDir + ' folder, serve on **' + config.serverDev.protocol + '://' + config.serverDev.hostname + ':' + config.serverDev.port + '**, watch for changes and reload the browser automatically)');
    this.defineNpmTask('build', ['clean:prod', 'build:prod'], 'Generate production build into <%= link(paths.output.prodDir) %> folder');
    this.defineNpmTask('build:serve', ['build', 'serve:prod'], 'Generate production build and serve on **' + config.serverProd.protocol + '://' + config.serverProd.hostname + ':' + config.serverProd.port + '**');

    // Low-level tasks
    this.defineNpmTask('clean:dev', ['rm -rf ' + paths.output.devDir]);
    this.defineNpmTask('clean:prod', ['rm -rf ' + paths.output.prodDir]);

    this.generateReadmeFile();
  },

  install: function() {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true,
      bower: false
    });
  }
});


