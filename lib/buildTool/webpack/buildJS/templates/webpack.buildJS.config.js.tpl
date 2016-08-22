/** JS START */
<%
// If ES6 -> ES5
var sourceFormat = buildJS.sourceFormat;
var outputFormat = buildJS.outputFormat;
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
var srcDirRegEx = new RegExp(paths.input.srcDir.replace(/\//g, '\\/') + '.*\\.(' + jsExtensions.join('|') + ')$');

if (sourceFormat === 'ES6' && outputFormat === 'ES5') {%>
var srcLoader = {
  test: helpers.pathRegEx(<%= srcDirRegEx.toString() %>),
  loader: 'babel-loader',
  exclude: moduleDirectories,    // There should be no need to exclude unit or browser tests because they should NOT be part of the source code dependency tree
  query: {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: true,
    presets: ['es2015'],
    // Generate the "default" export when using Babel 6: http://stackoverflow.com/questions/34736771/webpack-umd-library-return-object-default
    plugins: ['add-module-exports']
  }
};<%
}

if (sourceFormat === 'TypeScript') { %>

// Not used yet, but can speed up compile time for TypeScript AND Babel
//const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

var srcLoader = {
  test: helpers.pathRegEx(<%= srcDirRegEx.toString() %>),
  loader: 'awesome-typescript-loader'
};
<%
}
%>
config.module.loaders.push(srcLoader);
/* **/
