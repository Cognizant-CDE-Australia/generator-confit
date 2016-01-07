  /** Build START */
  output: {
    filename: projectPaths.output.jsSubDir + '[name].[hash:8].js',
    chunkFilename: projectPaths.output.jsSubDir + '[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: projectPaths.output.prodDir,
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },
  /* **/
