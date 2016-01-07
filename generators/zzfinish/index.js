'use strict';
var confitGen = require('../../lib/ConfitGenerator.js');
var chalk = require('chalk');

module.exports = confitGen.create({
  writing: function() {
    this.buildTool.write(this);

    var config = this.config.getAll();
    var paths = config.paths;

    // Global task-wiring, independent of any particular tool (although there is some knowledge that the child-tasks MUST exist, and how they should be run together).
    this.defineNpmTask('start', ['npm run dev'], 'Alias for "npm run dev" task');
    this.defineNpmTask('dev', ['clean:dev', 'verify', '--parallel verify:watch build:dev serve:dev'], 'Run project in development mode. Cleans, verifies code, creates dev build, runs dev web server');
    this.defineNpmTask('build', ['clean:prod', 'build:prod'], 'Generate production build');
    this.defineNpmTask('build:serve', ['build', 'serve:prod'], 'Generate production build and runs on web server');

    // Low-level tasks
    this.defineNpmTask('clean:dev', ['rm -rf ' + paths.output.devDir]);
    this.defineNpmTask('clean:prod', ['rm -rf ' + paths.output.prodDir]);
  },

  install: function() {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: true
    });
  }
});
