'use strict';
var Base = require('yeoman-generator').Base;
var _ = require('lodash');
var Storage = require('yeoman-generator/lib/util/storage');
var path = require('path');

// Override the _getStorage() method to store our config in confit.json
Base.prototype._getStorage = function () {
  var storePath = path.join(this.destinationRoot(), 'confit.json');
  return new Storage(this.rootGeneratorName(), this.fs, storePath);
};


module.exports = {

  create: function(extraConfig) {

    var yoConfig = _.merge(
      {
        initializing: {
          preInit: function() {
            // Extend the object instance with the methods in common.js
            _.merge(this, require('./common.js')(this));

            try {
              this.buildTool = this.getBuildTool();
            } catch(e) {
              // The NullBuildTool:
              this.buildTool = {
                write: function() {}
              };
            }
          }
        }
      },
      extraConfig
    );

    return Base.extend(yoConfig);
  }
};
