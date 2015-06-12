module.exports = function() {
  'use strict';

  function write(gen) {
    var config = gen.getGlobalConfig();

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
