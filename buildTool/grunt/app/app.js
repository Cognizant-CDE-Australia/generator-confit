module.exports = function() {
  'use strict';

  function write() {
    //gen.log('Writing "app" using GruntJS');

    this.fs.copy(
      this.toolTemplatePath('../../app/templates/_Gruntfile.js'),
      this.destinationPath('Gruntfile.js')
    );

    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().app.packages);
  }

  return {
    write: write
  };
};
