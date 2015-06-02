module.exports = function() {
  'use strict';

  function write(gen) {
    var config = gen.getGlobalConfig();

    // Generate a file in %configDir/grunt called "gruntBuildHTML.js", if it doesn't already exist
    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntBuild.js.tpl'),
      gen.destinationPath('config/grunt/build.js'),
      config
    );
  }

  return {
    write: write
  };
};
