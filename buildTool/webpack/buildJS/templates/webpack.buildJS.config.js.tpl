/** JS START */
<%
// Update entry point with vendor-key, if one does not already exist.
if (!entryPoint.entryPoints.vendor && buildJS.vendorBowerScripts) { %>
config.entry.vendor = confitConfig.buildJS.vendorBowerScripts.map(function(elem) {return elem.name;});
<%
}

// If ES6 -> ES5
var sourceFormat = buildJS.sourceFormat;
var outputFormat = buildJS.outputFormat;

if (sourceFormat !== outputFormat) { %>
var jsRE = new RegExp(projectPaths.input.modulesDir.replace(/\//g, '\\/') + '.*\.js$');
config.module.loaders.push({
  test: jsRE,
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
