'use strict';

// START_CONFIT_GENERATED_CONTENT
const devServer = require('swanky').devServer;

let devServerInstance = devServer({configPath: '<%- documentation.srcDir %>swanky.config.yaml'});
// END_CONFIT_GENERATED_CONTENT


// Start swanky dev server
module.exports = devServerInstance;
