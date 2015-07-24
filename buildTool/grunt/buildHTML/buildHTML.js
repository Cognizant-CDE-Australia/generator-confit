module.exports = function() {
  'use strict';

  function write(gen) {
    var config = gen.getGlobalConfig();

    // Generate a file in %configDir/grunt called "gruntBuildHTML.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntBuildHTML.js.tpl'),
      gen.destinationPath('config/grunt/buildHTML.js'),
      config
    );

    // Modify Package JSON
    gen.setNpmDevDependencies({
      'grunt-contrib-copy': '*',
      'grunt-targethtml': '*'
    });
  }

  return {
    write: write
  };
};
