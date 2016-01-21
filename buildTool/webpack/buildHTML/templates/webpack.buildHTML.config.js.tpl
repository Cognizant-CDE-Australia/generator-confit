/** HTML START */
var HtmlWebpackPlugin = require('html-webpack-plugin');

config.module.loaders.push({
  test: /\.html$/,
  loader: 'html-loader?minimize=true',
  exclude: /index-template.html$/
});

config.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: false,      // We want full control over where we inject the CSS and JS files
    template: basePath + '<%= paths.input.srcDir %>index-template.html'
  })
);
/* **/
