// Override default Swanky config

const buildConfig = require('swanky-server').buildConfig(__dirname + '/swanky.config.yaml');

const basePath = __dirname + '/../../';

// Change location of snippets and source code

buildConfig.output.path = basePath + 'website';

// Retrieve webpack build configuration
module.exports = buildConfig;
