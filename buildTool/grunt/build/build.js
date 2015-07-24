module.exports = function() {
  'use strict';

  function write(gen) {
    var config = gen.getGlobalConfig();

    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntBuild.js.tpl'),
      gen.destinationPath('config/grunt/build.js'),
      config
    );
  }

  return {
    write: write
  };
};
