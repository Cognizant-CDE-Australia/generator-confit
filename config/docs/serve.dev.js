const devServer = require('swanky-server').devServer;

// Start swanky dev server
module.exports = devServer(__dirname + '/swanky.config.yaml');
