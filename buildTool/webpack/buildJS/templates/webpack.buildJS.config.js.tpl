/** JS START */
<%
// Update entry point with vendor-key, if one does not already exist.
if (!entryPoint.entryPoints.vendor && buildJS.vendorScripts.length) { -%>
// Add "vendor" entry point for the vendor JS modules / scripts
config.entry.vendor = ['<%- buildJS.vendorScripts.join('\', \'') -%>'];

// Create a common chunk for the vendor modules (https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk)
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: '<%- paths.output.vendorJSSubDir %>vendor.[hash:8].js'
}));
<%
}

// If ES6 -> ES5
var sourceFormat = buildJS.sourceFormat;
var outputFormat = buildJS.outputFormat;

if (sourceFormat !== outputFormat) { %>
var jsRE = new RegExp(projectPaths.input.modulesDir.replace(/\//g, '\\/') + '.*\.jsx?$');
config.module.loaders.push({
  test: jsRE,
  loader: 'babel-loader',
  // TODO: Should we do this?
  // exclude: [nodeModulesPath]
  query: {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['react','es2015']
  }
});<%
}
%>
/* **/
