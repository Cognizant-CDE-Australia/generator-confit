'use strict';

module.exports = function() {

  function write(gen) {
    gen.log('Writing "entryPoint" options');

    // Add the NPM dev dependencies
    gen.setNpmDevDependencies({
      'lodash': '*'
    });


    // TODO: Do we want to do anything with regard to vendor bower scripts?
    // vendor: <% var vendors = []
    //   for (var obj in buildJS.vendorBowerScripts) {
    //     vendors.push(obj.name);
    //   }
    // %><%= vendors %>


    var config = gen.getGlobalConfig();
    var outputDir = config.paths.config.configDir;

    gen.fs.copy(
      gen.toolTemplatePath('webpack.entryPoint.config.js'),
      gen.destinationPath(outputDir + 'webpack/webpack.entryPoint.config.js')
    );
  }

  return {
    write: write
  };
};
