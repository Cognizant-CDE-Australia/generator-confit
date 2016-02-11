/** CSS START **/
<%
// The css question around broswer support should change this variable
var autoprefixLoader = buildCSS.autoprefixer ? '!autoprefixer-loader?browsers=last 2 versions' : '';

if (buildCSS.sourceFormat === 'sass') { %>
config.module.loaders.push({
  test: /\.(<%= resources.buildCSS.sourceFormat.sass.ext.join('|') %>)$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader<%= autoprefixLoader %>!sass-loader?indentedSyntax=true')
});<%

} else if (buildCSS.sourceFormat === 'stylus') {

-%>
config.module.loaders.push({
  test: /\.(<%= resources.buildCSS.sourceFormat.stylus.ext.join('|') %>)/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader<%= autoprefixLoader %>!stylus-loader')
});<%

} else {

-%>
config.module.loaders.push({
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader<%= autoprefixLoader %>')
});<%
} -%>

// For any entry-point CSS file definitions, extract them as text files as well
config.plugins.push(new ExtractTextPlugin('css/[name].[contenthash:8].css', { allChunks: true }));
/* **/
