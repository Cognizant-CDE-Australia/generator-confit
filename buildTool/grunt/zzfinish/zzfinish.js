'use strict';

module.exports = function() {

  function write() {
    this.log('Writing Grunt finish options');

    // Setup things to run on end, if we have anything
    var cmd = this.buildTool.getResources().zzfinish.onEnd;
    if (cmd) {
      this.runOnEnd(cmd.cmd, cmd.args);
    }
  }

  return {
    write: write
  };
};
