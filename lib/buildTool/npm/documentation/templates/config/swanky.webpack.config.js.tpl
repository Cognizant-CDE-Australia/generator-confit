'use strict';

// START_CONFIT_GENERATED_CONTENT
<%
var configPath = paths.config.configDir + 'docs/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
-%>
const buildConfig = require('swanky-server').buildConfig(__dirname + '<%- relativePath + documentation.srcDir %>swanky.config.yaml');
// END_CONFIT_GENERATED_CONTENT


module.exports = buildConfig;
