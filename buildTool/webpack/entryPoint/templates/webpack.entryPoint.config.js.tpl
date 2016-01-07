  /** Entry point config -- start **/
  context: path.resolve(basePath + projectPaths.input.srcDir.substr(0, projectPaths.input.srcDir.length - 1)),   // The baseDir for resolving the Entry option
  entry: confitConfig.entryPoint.entryPoints,
  /** Entry point config -- end **/
