'use strict';
var _ = require('lodash');

module.exports = function() {

  var gruntApp = require('./../app/app')();

  function write(gen) {
    gruntApp.write(gen); // Make sure we have a Gruntfile.js

    gen.log('Writing Grunt verify options');

    var config = gen.config.getAll();
    var outputDir = config.paths.config.configDir;

    // Create a combined 'allLinters' array, to make the grunt template simpler to maintain
    config.verify.allLinters = config.verify.jsLinter;

    var cssLinters = {
      sass: 'sasslint',
      stylus: 'stylint'
    };

    if (cssLinters[config.buildCSS.cssCompiler]) {
      config.verify.allLinters.push(cssLinters[config.buildCSS.cssCompiler]);
    }

    setLintDependencies(config.verify.allLinters, gen);

    gen.fs.copyTpl(
      gen.toolTemplatePath('gruntVerify.js.tpl'),
      gen.destinationPath(outputDir + 'grunt/verify.js'),
      config
    );

    // Define the verify tasks
    gen.defineNpmTask('verify', ['grunt verify:all'], 'Verifies JS & CSS style and syntax');
    gen.defineNpmTask('verify:watch', ['grunt watch:verify'], 'Runs verify task whenever JS or CSS code changes');
  }


  function setLintDependencies(linters, gen) {
    gen.setNpmDevDependencies({'grunt': '0.4.5'});
    gen.setNpmDevDependencies({'grunt-newer': '*'}, linters.length > 0);
    gen.setNpmDevDependencies({'grunt-contrib-jshint': '*', 'jshint-stylish': '*'}, linters.indexOf('jshint') !== -1);
    gen.setNpmDevDependencies({'grunt-eslint': '*'}, linters.indexOf('eslint') !== -1);
    gen.setNpmDevDependencies({'grunt-jscs': '*'}, linters.indexOf('jscs') !== -1);
    gen.setNpmDevDependencies({'grunt-sass-lint': '*'}, linters.indexOf('sasslint') !== -1);
    gen.setNpmDevDependencies({'grunt-stylint': '*'}, linters.indexOf('stylint') !== -1);
  }

  return {
    write: write
  };
};
