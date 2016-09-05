/** CSS START **/
<%
if (buildCSS.autoprefixer) {

  var browserStringArray = [];

  buildBrowser.browserSupport.forEach(function(item) {
    if (resources.buildBrowser.supportedBrowsers[item]) {
      browserStringArray = browserStringArray.concat(resources.buildBrowser.supportedBrowsers[item].browserList);
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
var cssLoader = {
  test: helpers.pathRegEx(/\.(<%= resources.buildCSS.sourceFormat.sass.ext.join('|') %>)$/),
  loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader!postcss-loader!sass-loader?indentedSyntax=true'})
  }
};<%
} else if (buildCSS.sourceFormat === 'stylus') {

-%>
var cssLoader = {
  test: helpers.pathRegEx(/\.(<%= resources.buildCSS.sourceFormat.stylus.ext.join('|') %>)/),
  loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader!postcss-loader!stylus-loader'})
};<%
} else {

-%>
var cssLoader = {
  test: helpers.pathRegEx(/\.css$/),
  loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader!postcss-loader'})
};<%}%>
config.module.loaders.push(cssLoader);

// For any entry-point CSS file definitions, extract them as text files as well
var extractCSSTextPlugin = new ExtractTextPlugin({filename: 'css/[name].[contenthash:8].css', allChunks: true});
config.plugins.push(extractCSSTextPlugin);
/* **/
