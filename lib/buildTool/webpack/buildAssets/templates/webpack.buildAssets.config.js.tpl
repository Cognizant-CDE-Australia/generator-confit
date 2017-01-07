  /** Assets START **/
  <%
  var assetsDir = paths.input.assetsDir.replace(/\//g, '\\/');

  var assetConfig = [
    { name: 'fontLoader',  srcSubDir: 'font',  destSubDir: 'font',  ext: 'eot|otf|svg|ttf|woff|woff2' },
    { name: 'imgLoader',   srcSubDir: 'img',   destSubDir: 'img',   ext: 'gif|ico|jpe?g|png|svg|webp' },
    { name: 'mediaLoader', srcSubDir: 'media', destSubDir: 'media', ext: 'mp4|webm|wav|mp3|m4a|aac|oga' }
  ];

  // The (.+?)(\.[^.]*$|$) regEx is designed to get just the name of a file. See http://stackoverflow.com/questions/624870/regex-get-filename-without-extension-in-one-shot
  // On Windows, [name] was returning the entire path, not just the file name. Using the expression above works on OSX and Windows

  assetConfig.forEach(function(assetCfg) {
    var testRegEx = new RegExp(assetsDir + assetCfg.srcSubDir + '\/.*\\.(' + assetCfg.ext + ')$');
    var assetDirRegEx = paths.input.modulesSubDir + '(.*)/' + paths.input.assetsDir + assetCfg.srcSubDir + '/(.+?)(\.[^.]*$|$)';
  -%>
  // Output module-assets to: /assets/<moduleName>/<%- assetCfg.destSubDir %>/<fileName>
  // Other assets (such as assets in Bootstrap) will need their own loaders
  // File-loader still uses the older Webpack 1 syntax.
  let <%- assetCfg.name %> = {
    test: helpers.pathRegEx(<%- testRegEx.toString() %>),
    loader: 'file-loader?name=<%- paths.output.assetsSubDir %>[1]/<%- assetCfg.destSubDir %>/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('<%- assetDirRegEx %>')
  };
  config.module.rules.push(<%- assetCfg.name %>);
  <% }); %>

  /* **/
