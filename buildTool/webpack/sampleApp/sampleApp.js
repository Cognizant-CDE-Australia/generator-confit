'use strict';

module.exports = function() {

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
    write: write
  };
};
