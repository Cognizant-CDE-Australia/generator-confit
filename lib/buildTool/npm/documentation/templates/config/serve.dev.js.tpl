'use strict';

// START_CONFIT_GENERATED_CONTENT
<%
var configPath = paths.config.configDir + resources.documentation.configSubDir;
var relativePath = configPath.replace(/([^/]+)/g, '..');
-%>
const devServer = require('swanky-server').devServer;

let devServerInstance = devServer(__dirname + '/<%- relativePath + documentation.srcDir %>swanky.config.yaml');
// END_CONFIT_GENERATED_CONTENT



// Start swanky dev server
module.exports = devServerInstance;
