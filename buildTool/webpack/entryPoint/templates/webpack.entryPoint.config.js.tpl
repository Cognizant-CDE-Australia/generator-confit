  /** Entry point config -- start **/
  context: basePath + '<%= paths.input.srcDir.slice(0, -1) %>',  // The baseDir for resolving the Entry option and the HTML-Webpack-Plugin
  entry: <%- JSON.stringify(entryPoint.entryPoints, null, '\t\t').replace(/"/g, '\'') %>,
  /** Entry point config -- end **/
