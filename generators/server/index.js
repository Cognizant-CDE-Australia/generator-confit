'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', {
      required: false,
      type: String,
      desc: 'The subgenerator name'
    });


    if (this.name) {
      this.log('Creating a server called "' + this.name + '".');
    }
  },

  prompting: function () {
    var done = this.async();
    var self = this;

    var prompts = [
      {
        type: 'input',
        name: 'serverName',
        message: 'Name of the server to generate?',
        default: 'dev',
        when: function() {
          // Only ask this question when self.name is undefined
          return self.name === undefined;
        }
      },
      {
        type: 'input',
        name: 'baseDir',
        message: 'Base directory',
        default: this.config.get('baseDir') || 'dev' // This should default to a path in the base config - which we can read from generator.config.get()
      }
    ];


    this.prompt(prompts, function (props) {
      this.serverName = props.serverName;
      this.baseDir = props.baseDir;
      done();
    }.bind(this));
  },


  writing: function () {
    // Defer the actual writing to the task-runner-choice the user has made (currently), this is Grunt.
    // require(this.taskRunnerName + 'Writer.js').write(this);

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    this.fs.copy(
      this.templatePath('serve.js'),
      this.destinationPath('config/grunt/serve.js')
    );
    // Modify Package JSON to use grunt-connect


    // Create a new section in the file based on the responses


    // Update the generator config.
    this.config.set('baseDir', this.baseDir);   // This isn't a perfect example... it really represents 'the last-specified baseDir', rather than the 'global baseDir'.
  }
});
