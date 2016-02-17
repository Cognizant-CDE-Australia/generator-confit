/** Assets START **/
<%
var assetsDir = paths.input.assetsDir.replace(/\//g, '\\/');
var fontsRegEx = new RegExp(assetsDir + 'font\/.*\\.(eot|otf|svg|ttf|woff|woff2)$');
var fontsDirRegEx = paths.input.modulesSubDir + '(.*)/' + paths.input.assetsDir + 'font/.*';
-%>
config.module.loaders.push({
  test: <%= fontsRegEx.toString() %>,
  loader: 'file-loader?name=/<%= paths.output.assetsSubDir %>[1]/font/[name].[hash:8].[ext]&regExp=<%= fontsDirRegEx %>'
});

<%
var imagesRegEx = new RegExp(assetsDir + 'img\/.*\\.(gif|ico|jpg|png|svg)$');
var imageDirRegEx = paths.input.modulesSubDir + '(.*)/' + paths.input.assetsDir + 'img/.*';
-%>
config.module.loaders.push({
  test: <%= imagesRegEx.toString() %>,
  loader: 'file-loader?name=/<%= paths.output.assetsSubDir %>[1]/img/[name].[hash:8].[ext]&regExp=<%= imageDirRegEx %>'
});
/* **/
