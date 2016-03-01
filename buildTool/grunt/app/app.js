module.exports = function() {
  'use strict';

  function write() {
    //gen.log('Writing "app" using GruntJS');
    var config = this.getGlobalConfig();

    this.fs.copyTpl(
      // We have to have this relative path because this 'app' buildTool is called from another buildTool/generator at the moment
      this.toolTemplatePath('../../app/templates/Gruntfile.js.tpl'),
      this.destinationPath('Gruntfile.js'),
      config
    );

    this.setNpmDevDependenciesFromArray(this.buildTool.getResources().app.packages);
  }

  return {
    write: write
  };
};
