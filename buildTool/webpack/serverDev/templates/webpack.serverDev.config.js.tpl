/** Server - DEV - START */
config.devServer = {
  contentBase: config.output.path,  // We want to re-use this path
  noInfo: false,
  debug: true, // Makes no difference
  port: <%= serverDev.port %>,
  https: <%= serverDev.protocol === 'https' %>,
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
