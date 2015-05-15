module.exports = function() {
  'use strict';

  var _ = require('lodash');

  function write(gen, common) {
    var config = common.getConfig();  // Gets the entire config

    // Convert the config into an array of servers, to make it easier to generate the template
    var servers = _.values(config).filter(function(value) {
      return (typeof value === 'object');   // We only want objects
    });

    var configObj = {
      servers: servers
    };

    // Generate a file in %configDir/grunt called "serve.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntServe.js.tpl'),
      gen.destinationPath('config/grunt/serve.js'),
      configObj
    );

    // Modify Package JSON
    common.addNpmDevDependencies({
      'grunt-contrib-watch': '*',
      'grunt-contrib-connect': '*'
    });
  }

  return {
    write: write
  };
};

