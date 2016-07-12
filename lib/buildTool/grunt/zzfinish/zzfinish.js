'use strict';

module.exports = function() {
  return {
    write
  };
};


/**
 * @returns {undefined}
 * @this generator
 */
function write() {
  this.log('Writing Grunt finish options');
  let toolResources = this.buildTool.getResources().zzfinish;

  this.writeBuildToolConfig(toolResources);
}

