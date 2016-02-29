/** Server - DEV - START */
<% // It is convinient to keep the config lively so that we can run integration tests and change the server ports easily -%>
var confitConfig = require(path.join(process.cwd(), 'confit.json'))['generator-confit'];

config.devServer = {
  contentBase: config.output.path,  // We want to re-use this path
  noInfo: false,
  debug: true, // Makes no difference
  port: confitConfig.serverDev.port,
  https: confitConfig.serverDev.protocol === 'https',
  colors: true,
  // hot: true,    // Pass this from the command line as '--hot', which sets up the HotModuleReplacementPlugin automatically
  inline: true,
  // CORS settings:
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'accept, content-type, authorization',
    'Access-Control-Allow-Credentials': true
  }
};
/* **/
