const devServer = require('swanky-server').devServer;

// Start swanky dev server
module.exports = devServer(__dirname + '/../../docs/swanky.config.yaml');
