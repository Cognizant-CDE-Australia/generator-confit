/** TEST UNIT START */
<%
// If ES6 -> ES5
var sourceFormat = buildJS.sourceFormat;
var outputFormat = buildJS.outputFormat;

if (sourceFormat !== outputFormat) { -%>
config.module.loaders.push({
  test: /test\.files\.js$/,
  loader: 'babel-loader',
  query: {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015']
  }
});<%
}
%>
/* **/
