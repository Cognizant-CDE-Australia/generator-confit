/** HTML START */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlLoader = {
  test: /\.html$/,
  loader: 'html-loader',
  exclude: /index-template.html$/
};
config.module.loaders.push(htmlLoader);

// Configuration that works with Angular 2  :(
config.htmlLoader = {
  minimize: true,
  removeAttributeQuotes: false,
  caseSensitive: true,
  customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
  customAttrAssign: [ /\)?\]?=/ ]
};


var indexHtmlPlugin = new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: false,      // We want full control over where we inject the CSS and JS files
  template: path.join(basePath + '<%= paths.input.srcDir %>index-template.html')
});

config.plugins.push(indexHtmlPlugin);
/* **/
