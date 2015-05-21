'use strict';
var Base = require('yeoman-generator').Base;
var _ = require('lodash');

module.exports = {

  create: function(extraConfig) {

    var yoConfig = _.merge(
      {
        initializing: {
          preInit: function() {
            // Extend the object instance with the methods in common.js
            _.merge(this, require('./common.js')(this));
            this.buildTool = this.getBuildTool();
          }
        }
      },
      extraConfig
    );

    return Base.extend(yoConfig);
  }
};
