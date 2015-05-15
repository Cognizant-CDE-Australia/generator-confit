'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var common;
var buildTool;

module.exports = yeoman.generators.Base.extend({
  initializing: {
    preInit: function() {
      common = require('../app/common')(this, 'server');
      buildTool = common.getBuildTool();
    },
    init: function() {
      this.argument('name', {
        required: false,
        type: String,
        desc: 'The sub-generator name'
      });

      // Check if this component has an existing config. If it doesn't even if we are asked to rebuild, don't rebuild
      this.hasExistingConfig = common.hasExistingConfig();
      this.rebuildFromConfig = !!this.options.rebuildFromConfig && this.hasExistingConfig;
    }
  },

  prompting: function() {
    //this.log('Server: rebuildFromConfig = ' + this.rebuildFromConfig);

    // Bail out if we just want to rebuild from the configuration file
    if (this.rebuildFromConfig && !this.name) {
      return;
    }

    this.log(chalk.underline.bold.green('Server Generator'));
    if (this.name) {
      this.log('Creating/editing a server called "' + this.name + '".');
    }

    // Check the existing config, and list the existing servers. Once selected, you can edit or delete.
    this.answers = common.getConfig();
    var existingServers = [];

    for (var i in this.answers) {
      if (i !== common.versionProperty) {
        existingServers.push(i);
      }
    }

    var self = this;
    var done = this.async();

    var prompts = [
      {
        type: 'list',
        name: 'selectedServer',
        message: 'Select a server (or create a new one)',
        choices: function(answers) {
          return ['(new)'].concat(existingServers);
        },
        when: function(answers) {
          // Only ask this question when self.name is undefined
          return self.name === undefined;
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Server name',
        when: function(answers) {
          // Only ask this question when self.name is undefined && when the selected server is a new server
          //return (self.name === undefined && answers.selectedServer === '(new)') || existingServers.length === 0;
          return (self.name === undefined && answers.selectedServer === '(new)');
        },
        validate: function(input) {
          if (existingServers.indexOf(input) !== -1) {
            return 'A server called "' + input + '" already exists. Please choose a different name.';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'baseDir',
        message: 'Server base directory',
        default: function(answers) {
          return common.getConfig(answers.selectedServer + '.baseDir') || 'src'
        }
      },
      {
        type: 'input',
        name: 'port',
        message: 'Server port',
        default: function(answers) {
        return common.getConfig(answers.selectedServer + '.port') || '3000'
      }
      },
      {
        type: 'input',
        name: 'hostname',
        message: 'Server hostname',
        default: function(answers) {
          return common.getConfig(answers.selectedServer + '.hostname') || 'localhost'
        }
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Server protocol',
        choices: [
          'http',
          'https'
        ],
        default: function(answers) {
          return common.getConfig(answers.selectedServer + '.protocol') || 'https'
        }
      },
      {
        type: 'confirm',
        name: 'configureAnother',
        message: 'Configure another server?',
        default: false
      }
    ];

    function ask(gen, prompts, callback) {
      gen.prompt(prompts, function(props) {
        var serverAnswers = common.generateObjFromAnswers(props);
        var serverName = gen.name || serverAnswers.name || serverAnswers.selectedServer;

        serverAnswers.name = serverName;  // Make sure we have a name, even if we don't ask the question
        gen.name = undefined;             // Set this variable to undefined, so tht we don't keep skipping the "select a server" question

        gen.answers[serverName] = serverAnswers;   // This will replace any pre-existing config for this server
        delete serverAnswers.selectedServer;    // We don't want this to be stored

        existingServers.push(serverName);
        existingServers = _.unique(existingServers);

        //console.log(gen.answers);
        //console.log(existingServers);

        // Loop, if required
        if (props.configureAnother === true) {
          ask(gen, prompts, callback);
        } else {
          callback();
        }
      });
    }

    ask(this, prompts, done);
  },

  writeConfig: function() {
    // If we have new answers, then change the config
    if (this.answers) {
      common.setConfig(this.answers);
    }
  },

  writing: function () {
    buildTool.write(this, common);
  },

  install: function () {
    // InstallDependencies runs 'npm install' and 'bower install'
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
