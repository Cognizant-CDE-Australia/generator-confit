//** Assets START **/
var assetsDir = projectPaths.input.assetsDir.replace(/\//g, '\\/');
var fontsRegEx = new RegExp(assetsDir + 'font\/.*\.(eot|otf|svg|ttf|woff|woff2)$');
config.module.loaders.push({
  test: fontsRegEx,
  loader: 'file-loader?name=/' + projectPaths.output.assetsSubDir + '[1]/font/[name].[hash:8].[ext]&regExp=' + projectPaths.input.modulesSubDir + '(.*)/' + projectPaths.input.assetsDir + 'font/.*'
});

var imagesRegEx = new RegExp(assetsDir + 'img\/.*\.(gif|ico|jpg|png|svg)$');
config.module.loaders.push({
  test: imagesRegEx,
  loader: 'file-loader?name=/' + projectPaths.output.assetsSubDir + '[1]/img/[name].[hash:8].[ext]&regExp=' + projectPaths.input.modulesSubDir + '(.*)/' + projectPaths.input.assetsDir + 'img/.*'
});
/* **/
