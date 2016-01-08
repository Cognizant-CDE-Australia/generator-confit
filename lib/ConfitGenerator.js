'use strict';
var Base = require('yeoman-generator').Base;
var _ = require('lodash');
var Storage = require('yeoman-generator/lib/util/storage');
var path = require('path');

/**
 * Override the _getStorage() method to store our config in 'confit.json'
 *
 * Can also be passed via the `configFile=path/to/file` flag on CLI
 */
Base.prototype._getStorage = function () {
  this.configFile = this.options.configFile || 'confit.json';
  var storePath = path.join(this.destinationRoot(), this.configFile);
  return new Storage(this.rootGeneratorName(), this.fs, storePath);
};


module.exports = {

  create: function(extraConfig) {

    var yoConfig = _.merge(
      {
        initializing: {
          preInit: function() {
            // Extend the object instance with the methods in common.js
            require('./common.js').apply(this);
          }
        }
      },
      extraConfig
    );

    return Base.extend(yoConfig);
  }
};
