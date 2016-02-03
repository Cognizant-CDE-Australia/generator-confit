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

if (sourceFormat === 'ES6' && outputFormat === 'ES5') { %>
var jsRE = new RegExp(projectPaths.input.modulesDir.replace(/\//g, '\\/') + '.*\.js$');
config.module.loaders.push({
  test: jsRE,
  loader: 'babel-loader',
  exclude: ['node_modules'],    // There should be no need to exclude unit or browser tests because they should NOT be part of the source code dependency tree
  query: {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015']
  }
});<%
}

if (sourceFormat === 'TypeScript') { %>
config.module.loaders.push({
  test: /<%= paths.input.modulesDir.replace(/\//g, '\\/') %>.*\.ts$/,
  loader: 'ts-loader'
});
<%
}
%>
/* **/
