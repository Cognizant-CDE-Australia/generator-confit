/** HTML START */
var HtmlWebpackPlugin = require('html-webpack-plugin');

config.module.loaders.push({
  test: /\.html$/,
  loader: 'html-loader',
  exclude: /index-template.html$/
});

// Configuration that works with Angular 2  :(
config.htmlLoader = {
  minimize: true,
  removeAttributeQuotes: false,
  caseSensitive: true,
  customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
  customAttrAssign: [ /\)?\]?=/ ]
};

config.plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: false,      // We want full control over where we inject the CSS and JS files
    template: basePath + '<%= paths.input.srcDir %>index-template.html'
  })
);
/* **/
