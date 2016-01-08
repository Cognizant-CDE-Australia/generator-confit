'use strict';
var _ = require('lodash');

module.exports = function() {

  var gruntApp = require('./../app/app')();

  function write() {
    gruntApp.write.apply(this); // Make sure we have a Gruntfile.js

    this.log('Writing Grunt verify options');

    var config = this.config.getAll();
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

    setLintDependencies.call(this, config.verify.allLinters);

    this.fs.copyTpl(
      this.toolTemplatePath('gruntVerify.js.tpl'),
      this.destinationPath(outputDir + 'grunt/verify.js'),
      config
    );

    // Define the verify tasks
    this.defineNpmTask('verify', ['grunt verify'], 'Verifies JS & CSS style and syntax');
    this.defineNpmTask('verify:watch', ['grunt watch:verify'], 'Runs verify task whenever JS or CSS code changes');
  }


  function setLintDependencies(linters) {
    this.setNpmDevDependencies({'grunt': '0.4.5'});
    this.setNpmDevDependencies({'grunt-newer': '*'}, linters.length > 0);
    this.setNpmDevDependencies({'grunt-contrib-jshint': '*', 'jshint-stylish': '*'}, linters.indexOf('jshint') !== -1);
    this.setNpmDevDependencies({'grunt-eslint': '*'}, linters.indexOf('eslint') !== -1);
    this.setNpmDevDependencies({'grunt-jscs': '*'}, linters.indexOf('jscs') !== -1);
    this.setNpmDevDependencies({'grunt-sass-lint': '*'}, linters.indexOf('sasslint') !== -1);
    this.setNpmDevDependencies({'grunt-stylint': '*'}, linters.indexOf('stylint') !== -1);
  }

  return {
    write: write
  };
};
