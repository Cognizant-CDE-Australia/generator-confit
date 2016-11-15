/** CSS START **/
const ExtractTextPlugin = require('extract-text-webpack-plugin');
<%
if (buildCSS.autoprefixer) {

  var browserStringArray = [];

  buildBrowser.browserSupport.forEach(function(item) {
    if (resources.buildBrowser.supportedBrowsers[item]) {
      browserStringArray = browserStringArray.concat(resources.buildBrowser.supportedBrowsers[item].browserList);
    }
  });
-%>
// Pass postCSS options onto the (temporary) loaderOptions property
const autoprefixer = require('autoprefixer');
config.loaderOptions.postcss = [
  autoprefixer({
    browsers: <%- printJson(browserStringArray, 4) %>
  })
];
<%
}

let cssExtensions = '';
let cssLoaderOptions = ''

if (buildCSS.sourceFormat === 'sass') {
  cssExtensions = resources.buildCSS.sourceFormat.sass.ext.join('|');
  cssLoaderOptions = '!sass-loader?indentedSyntax=true';

} else if (buildCSS.sourceFormat === 'stylus') {
  cssExtensions = resources.buildCSS.sourceFormat.stylus.ext.join('|');
  cssLoaderOptions = '!stylus-loader';

} else {
  cssExtensions = '.css';
  cssLoaderOptions = '';
}
%>
// ExtractTextPlugin still uses the older Webpack 1 syntax. See https://github.com/webpack/extract-text-webpack-plugin/issues/275
let cssLoader = {
  test: helpers.pathRegEx(/\.(<%= cssExtensions %>)$/),
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader!postcss-loader<%- cssLoaderOptions %>',
    publicPath: '/'   // If this is not specified or is blank, it defaults to 'css/'
  })
};
config.module.rules.push(cssLoader);

// For any entry-point CSS file definitions, extract them as text files as well
let extractCSSTextPlugin = new ExtractTextPlugin({
  filename: 'css/[name].[contenthash:8].css',
  allChunks: true
});
config.plugins.push(extractCSSTextPlugin);
/* **/
