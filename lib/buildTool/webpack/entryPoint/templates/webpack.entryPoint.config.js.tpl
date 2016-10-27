/** Entry point START **/

<%
// Copy the entryPoint config into a new object to (minimise mutation)
var newEntryPoints = {};

// For React HMR to work, we need to add an entryPoint script before any other ones:
if (buildJS.framework.indexOf('React (latest)') > -1) {
  newEntryPoints.__reactHotModulePatch = 'react-hot-loader/patch';
}

newEntryPoints = merge(newEntryPoints, entryPoint.entryPoints);
-%>
config.entry = <%- printJson(newEntryPoints) %>;

<%
// There are benefits to having the vendor scripts separate to the source code (faster recompilation when changing source code, caching of vendor JS file)
// So we create / edit a vendor entryPoint containing the known vendor scripts, including ones that the sampleApp may want to add

var sourceFormat = buildJS.sourceFormat;
var selectedFramework = buildJS.framework[0] || '';
var selectedFrameworkConfig = resources.frameworks[selectedFramework];

// If there is a user-defined 'vendor' entryPoint or buildJS vendorsScripts or sampleApp vendor scripts, proceed...
if (entryPoint.entryPoints.vendor || buildJS.vendorScripts.length) {
  var vendorScripts = [].concat(entryPoint.entryPoints.vendor || buildJS.vendorScripts || []);
-%>
// (Re)create the config.entry.vendor entryPoint
config.entry.vendor = <%- printJson(vendorScripts) %>;


// Create a common chunk for the vendor modules (https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk)
var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: '<%- paths.output.vendorJSSubDir %>[name].[hash:8].js',
  minChunks: Infinity
});
config.plugins.push(commonsChunkPlugin);
<%
}
%>
/** Entry point END **/
