/** HTML START */
const HtmlWebpackPlugin = require('html-webpack-plugin');

let indexHtmlPlugin = new HtmlWebpackPlugin({
  template: helpers.root('<%= paths.input.srcDir %>index-template.html'),
  filename: 'index.html',
  title: METADATA.title,
  chunksSortMode: 'dependency',
  metadata: METADATA,   // Becomes available in the template as 'options.metadata'
  inject: false         // We want full control over where we inject the CSS and JS files
});
config.plugins.push(indexHtmlPlugin);


let htmlLoader = {
  test: /\<%= buildHTML.extension %>$/,
  use: [
    {
      loader: 'html-loader'
    }
  ],
  exclude: /index-template.html$/
};
config.module.rules.push(htmlLoader);


<%
var selectedFramework = buildJS.framework[0] || '';
if (selectedFramework === 'AngularJS 2.x') { %>
// Configuration that works with Angular 2
config.loaderOptions.htmlLoader = {
  minimize: true,
  removeAttributeQuotes: false,
  caseSensitive: true,
  customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ],
  customAttrAssign: [ /\)?\]?=/ ]
};
<% } %>
/* **/
