  /** Server - DEV - START */
<% // It is convenient to keep the config lively so that we can run integration tests and change the server ports easily -%>
  const yaml = require('js-yaml');
  const fs = require('fs');   // path is declared elsewhere
  const confitConfig = yaml.load(fs.readFileSync(path.join(process.cwd(), 'confit.yml')))['generator-confit'];  // Try to keep the code lively! If confit.json changes, this code still works.

  const HOST = process.env.HOST || confitConfig.serverDev.hostname;
  const PORT = Number(process.env.PORT || confitConfig.serverDev.port);

  /**
   * Webpack Development Server configuration
   * Description: The webpack-dev-server is a little node.js Express server.
   * The server emits information about the compilation state to the client,
   * which reacts to those events.
   *
   * See: https://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: path.resolve(__dirname, '<%- paths.output.devDir %>'),  // We want to re-use this path
    port: PORT,
    host: HOST,
    https: confitConfig.serverDev.protocol === 'https',
    noInfo: false,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    // CORS settings:
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'accept, content-type, authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  };
  /* **/
