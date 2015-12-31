/** HTML START */
var HtmlWebpackPlugin = require('html-webpack-plugin');

config.module.loaders.push({
  test: /\.html$/,
  loader: 'html-loader?minimize=true'
});

config.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index-template.html'
  })
);
/* **/
