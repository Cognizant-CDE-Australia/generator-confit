  /** Build START */
  output: {
    filename: '<%= paths.output.jsSubDir %>[name].[hash:8].js',
    chunkFilename: '<%= paths.output.jsSubDir %>[id].[chunkhash:8].js',  // The name for non-entry chunks
    path: '<%= paths.output.prodDir %>',
    pathinfo: false   // Add path info beside module numbers in source code. Do not set to 'true' in production. http://webpack.github.io/docs/configuration.html#output-pathinfo
  },
  /* **/
