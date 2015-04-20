'use strict';
var yeoman = require('yeoman-generator');
var common;
var taskRunner;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.log('Project path generator: ' + this.options.rebuildFromConfig);
    common = require('../app/common')(this);
    taskRunner = common.getTaskRunner('paths');

    this.rebuildFromConfig = this.options.rebuildFromConfig;
    this.log('Paths: rebuildFromConfig = ' + this.rebuildFromConfig);
  },

  prompting: function () {
    var done = this.async();
    var self = this;

    var prompts = [
      {
        type: 'input',
        name: 'srcDir',
        message: 'Path to source code (relative to the current directory)',
        default: self.config.get('input.srcDir') || 'src'
      },
      {
        type: 'input',
        name: 'modulesDir',
        message: 'Path to source modules',
        default: this.config.get('input.modulesDir') || 'src/modules' // This should default to a path in the base config - which we can read from generator.config.get()
      }
    ];


    this.prompt(prompts, function (props) {
      this.srcDir = props.srcDir;
      this.modulesDir = props.modulesDir;
      done();
    }.bind(this));
  },

  writeConfig: function() {
    // Where we save the configuration for the project
    this.config.set('srcDir', this.srcDir);
    this.config.set('modulesDir', this.modulesDir);
  },


  writing: function () {
    // Defer the actual writing to the task-runner-choice the user has made (currently), this is Grunt.
    // require(this.taskRunnerName + 'Writer.js').write(this);
    taskRunner.write(this);
  }
});
