'use strict';
var _ = require('lodash');

module.exports = function() {

  function copyLintDependencies(linter, jsLintConfig, gen) {
    gen.log('linter' + linter);
    gen.setNpmDevDependencies({'grunt-contrib-jshint': '*', 'jshint-stylish': '*'}, linter.indexOf('jshint') !== -1);
    gen.setNpmDevDependencies({'gruntify-eslint': '*'}, linter.indexOf('eslint') !== -1);
    gen.setNpmDevDependencies({'grunt-jscs': '*'}, linter.indexOf('jscs') !== -1);

    for (var i = 0; i < linter.length; i++) {
      gen.fs.copy(
        gen.templatePath(jsLintConfig[linter[i]].src),
        gen.destinationPath(jsLintConfig[linter[i]].dest)
      );
    }
  }

  function write(gen) {
    gen.log('Writing Grunt verify options');

    var config = gen.config.getAll(),
        verify = config.verify;

    copyLintDependencies(verify.jsLinter, verify.jsLintConfig, gen);

    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntVerify.js.tpl'),
      gen.destinationPath('config/grunt/verify.js'),
      config
    );
  }


  return {
    write: write
  };
};
