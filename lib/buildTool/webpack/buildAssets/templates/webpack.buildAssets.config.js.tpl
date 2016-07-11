/** Assets START **/
<%
var assetsDir = paths.input.assetsDir.replace(/\//g, '\\/');
var fontsRegEx = new RegExp(assetsDir + 'font\/.*\\.(eot|otf|svg|ttf|woff|woff2)$');
// The (.+?)(\.[^.]*$|$) regEx is designed to get just the name of a file. See http://stackoverflow.com/questions/624870/regex-get-filename-without-extension-in-one-shot
// On Windows, [name] was returning the entire path, not just the file name. Using the expression above works on OSX and Windows
var fontsDirRegEx = paths.input.modulesSubDir + '(.*)/' + paths.input.assetsDir + 'font/(.+?)(\.[^.]*$|$)';
-%>
// Output module-assets to: /assets/<moduleName>/img|font/<fileName>
// Other assets (such as assets in Bootstrap) will need their own loaders
var fontLoader = {
  $$name: 'fontLoader',
  test: helpers.pathRegEx(<%= fontsRegEx.toString() %>),
  loader: 'file-loader?name=/<%= paths.output.assetsSubDir %>[1]/font/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('<%= fontsDirRegEx %>')
};
config.module.loaders.push(fontLoader);

<%
var imagesRegEx = new RegExp(assetsDir + 'img\/.*\\.(gif|ico|jpg|png|svg)$');
var imageDirRegEx = paths.input.modulesSubDir + '(.*)/' + paths.input.assetsDir + 'img/(.+?)(\.[^.]*$|$)';
-%>
var imageLoader = {
  $$name: 'imageLoader',
  test: helpers.pathRegEx(<%= imagesRegEx.toString() %>),
  loader: 'file-loader?name=/<%= paths.output.assetsSubDir %>[1]/img/[2].[hash:8].[ext]&regExp=' + helpers.pathRegEx('<%= imageDirRegEx %>')
};
config.module.loaders.push(imageLoader);
/* **/
