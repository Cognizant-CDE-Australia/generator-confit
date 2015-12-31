'use strict';

module.exports = function() {

  function writeConfig(gen) {
    // Generate a Webpack-specific version of the sample entry points
    var config = gen.getGlobalConfig();
    var modulesDir = config.paths.input.modulesSubDir;

    gen.answers.sampleAppEntryPoint = {
      app: ['./' + modulesDir + gen.demoOutputModuleDir + 'app.js']
    };
  }


  function write(gen) {
    gen.log('Writing "sampleApp" using Webpack');

    var config = gen.getGlobalConfig();
    var outputDir = config.paths.input.srcDir;

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'lodash': '*'
    });

    // Web-pack specific index.html template
    gen.fs.copy(gen.toolTemplatePath('index-template.html'), gen.destinationPath(outputDir + 'index-template.html'));
  }

  return {
    writeConfig: writeConfig,
    write: write
  };
};
