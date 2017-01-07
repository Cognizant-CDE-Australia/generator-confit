  /** Entry point START **/

  config.entry = <%- printJson(entryPoint.entryPoints, 2) %>;

  <%
  // There are benefits to having the vendor scripts separate from the source code (faster recompilation when changing source code, caching of vendor JS file)
  // So we create / edit a vendor entryPoint containing the known vendor scripts, including ones that the sampleApp may want to add

  var sourceFormat = buildJS.sourceFormat;
  var selectedFramework = buildJS.framework[0] || '';
  var selectedFrameworkConfig = resources.frameworks[selectedFramework];

  // If there is a user-defined 'vendor' entryPoint or buildJS vendorsScripts or sampleApp vendor scripts, proceed...
  if (entryPoint.entryPoints.vendor || buildJS.vendorScripts.length) {
    var vendorScripts = [].concat(entryPoint.entryPoints.vendor || buildJS.vendorScripts || []);

    // Remove the @types from the vendor scripts, as they are development dependencies
    vendorScripts = vendorScripts.filter(function(scriptName) {
      return scriptName.indexOf('@types') !== 0
    });
  -%>
  // (Re)create the config.entry.vendor entryPoint
  config.entry.vendor = <%- printJson(vendorScripts, 2) %>;



  /*
   * Plugin: CommonsChunkPlugin
   * Description: Shares common code between the pages.
   * It identifies common modules and put them into a commons chunk.
   *
   * See: https://webpack.js.org/how-to/code-splitting/splitting-vendor/#commonschunkplugin
   * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
   */
  let commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest'],
    filename: '<%- paths.output.vendorJSSubDir %>[name].[hash:8].js',
    minChunks: Infinity
  });
  config.plugins.push(commonsChunkPlugin);
  <%
  }
  %>
  /** Entry point END **/
