/** CSS START **/
<%
if (buildCSS.autoprefixer) {

  var browserStringArray = [];

  app.browserSupport.forEach(function(item) {
    if (resources.app.supportedBrowsers[item]) {
      browserStringArray = browserStringArray.concat(resources.app.supportedBrowsers[item].browserList);
    }
  });
-%>
var autoprefixer = require('autoprefixer');
config.postcss = [
  autoprefixer({
    browsers: <%- printJson(browserStringArray, 4) %>
  })
];
<%
}

if (buildCSS.sourceFormat === 'sass') { %>
config.module.loaders.push({
  test: /\.(<%= resources.buildCSS.sourceFormat.sass.ext.join('|') %>)$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader?indentedSyntax=true')
});<%

} else if (buildCSS.sourceFormat === 'stylus') {

-%>
config.module.loaders.push({
  test: /\.(<%= resources.buildCSS.sourceFormat.stylus.ext.join('|') %>)/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
});<%

} else {

-%>
config.module.loaders.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
});<%
} -%>

// For any entry-point CSS file definitions, extract them as text files as well
config.plugins.push(new ExtractTextPlugin('css/[name].[contenthash:8].css', { allChunks: true }));
/* **/
