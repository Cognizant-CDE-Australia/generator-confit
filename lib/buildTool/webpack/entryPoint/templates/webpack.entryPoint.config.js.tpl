/** Entry point START **/
config.entry = <%- printJson(entryPoint.entryPoints) %>;

<%
// There are benefits to having the vendor scripts separate to the source code (faster recompilation when changing source code, caching of vendor JS file)
// So we create / edit a vendor entryPoint containing the known vendor scripts, including ones that the sampleApp may want to add

var sourceFormat = buildJS.sourceFormat;
var selectedFramework = buildJS.framework[0] || '';
var selectedFrameworkConfig = resources.frameworks[selectedFramework];
var sampleAppVendorScripts = selectedFrameworkConfig[sourceFormat].vendorScripts


// If there is a user-defined 'vendor' entryPoint or buildJS vendorsScripts or sampleApp vendor scripts, proceed...
if (entryPoint.entryPoints.vendor || buildJS.vendorScripts.length || sampleAppVendorScripts) {
  var vendorScripts = (buildJS.frameworkScripts || []).concat(entryPoint.entryPoints.vendor || buildJS.vendorScripts || []);

  if (sampleAppVendorScripts) {
    vendorScripts = [].concat(
      sampleAppVendorScripts.pre,
      vendorScripts,
      sampleAppVendorScripts.post
    );
  } -%>
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
