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


// Extend the Base prototype
_.extend(Base.prototype, require('./buildToolUtils.js'));
_.extend(Base.prototype, require('./fileUtils.js'));
_.extend(Base.prototype, require('./npm.js'));
_.extend(Base.prototype, require('./resources.js'));
_.extend(Base.prototype, {ts: require('./TypeScriptUtils.js')});
_.extend(Base.prototype, require('./utils.js'));

//console.log(Base.prototype);

module.exports = {

  create: function(extraConfig) {

    var yoConfig = _.merge(
      {
        initializing: {
          preInit: function() {
            // Extend the object *instance* with the methods in common.js
            require('./common.js').apply(this);
          }
        }
      },
      extraConfig
    );

    return Base.extend(yoConfig);
  }
};
