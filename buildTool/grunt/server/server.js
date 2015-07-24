module.exports = function() {
  'use strict';

  var _ = require('lodash');

  function write(gen) {
    var config = gen.getConfig();  // Gets the entire config

    // Convert the config into an array of servers, to make it easier to generate the template
    var servers = _.values(config).filter(function(value) {
      return (typeof value === 'object');   // We only want objects, not strings or version numbers
    });

    var configObj = {
      servers: servers
    };

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntServe.js.tpl'),
      gen.destinationPath('config/grunt/serve.js'),
      configObj
    );

    // Modify Package JSON
    gen.setNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-connect': '*'
    });
  }

  return {
    write: write
  };
};

