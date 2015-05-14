module.exports = function() {
  'use strict';

  function write(gen) {
    gen.log('Writing grunt path options');

    var config = gen.config.get('paths');

    //gen.log(templates);

    gen.fs.copyTpl(
      gen.templatePath('../grunt/templates/gruntPaths.js'),
      gen.destinationPath('config/grunt/paths.js'),
      config
    );


    // Create the directory structure from the config
    var srcTmpDir = '../grunt/templates/src/';
    var moduleDir = srcTmpDir + 'modules/demoModule/';

    gen.fs.copy(gen.templatePath(srcTmpDir + 'index.html'), config.input.srcDir + 'index.html');
    gen.fs.copy(gen.templatePath(moduleDir + 'assets/*'), config.input.modulesDir + 'demoModule/' + config.input.assetsDir);
  }


  return {
    write: write
  };
};
