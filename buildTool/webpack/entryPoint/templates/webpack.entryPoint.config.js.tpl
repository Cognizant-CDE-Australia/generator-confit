  /** Entry point config -- start **/
  context: basePath + '<%= paths.input.srcDir.slice(0, -1) %>',  // The baseDir for resolving the Entry option and the HTML-Webpack-Plugin
  entry: confitConfig.entryPoint.entryPoints,
  /** Entry point config -- end **/
