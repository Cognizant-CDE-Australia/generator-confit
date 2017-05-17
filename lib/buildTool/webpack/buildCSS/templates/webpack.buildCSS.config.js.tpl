  /** CSS START **/
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  <%
  if (buildCSS.autoprefixer) {

    var browserStringArray = [];

    buildBrowser.browserSupport.forEach(function(item) {
      if (resources.buildBrowser.supportedBrowsers[item]) {
        browserStringArray = browserStringArray.concat(resources.buildBrowser.supportedBrowsers[item].browserList);
      }
    });
  -%>
  // Pass postCSS options onto the (temporary) loaderOptions property
  const autoprefixer = require('autoprefixer');
  let supportedBrowsers = {
    browsers: <%- printJson(browserStringArray, 4) %>
  };
  LOADER_OPTIONS.options.postcss = [
    autoprefixer(supportedBrowsers)
  ];
  <%
  }

  var cssExtensions = '';
  var cssLoaderName = '';
  var cssLoaderOptions = {};

  if (buildCSS.sourceFormat === 'sass') {
    cssExtensions = resources.buildCSS.sourceFormat.sass.ext.join('|');
    cssLoaderName = 'sass-loader';
    cssLoaderOptions.indentedSyntax = true;

  } else if (buildCSS.sourceFormat === 'stylus') {
    cssExtensions = resources.buildCSS.sourceFormat.stylus.ext.join('|');
    cssLoaderName = 'stylus-loader';

  } else {
    cssExtensions = 'css';
    cssLoaderName = '';
  }
  %>
  // If we are in development, we want live reloading for our CSS. So we cannot use ExtractTextPlugin
  // (see https://github.com/css-modules/webpack-demo/issues/8#issuecomment-135647584 and
  // https://ihaveabackup.net/article/sass-with-sourcemaps-webpack-and-live-reload)
  let cssLoader;
  let cssLoaderOptions = <%- printJson(cssLoaderOptions, 2) %>;

  if (METADATA.ENV === 'development') {
    // If you use the 'sourceMap' option with the css-loader, it has trouble resolving 'url(...)' properties in the CSS,
    // meaning your fonts may not show up.
    cssLoaderOptions.sourceMap = METADATA.cssSourceMap;
    cssLoader = {
      test: helpers.pathRegEx(/\.(<%= cssExtensions %>)$/),
      use: [
        {loader: 'style-loader'},
        {loader: 'css-loader', options: {sourceMap: METADATA.cssSourceMap}},
        {loader: 'postcss-loader'}<% if (cssLoaderName) { %>,
        {loader: '<%- cssLoaderName %>', options: cssLoaderOptions}<% } %>
      ]
    };
  } else {
    // ExtractTextPlugin still uses the older Webpack 1 syntax. See https://github.com/webpack/extract-text-webpack-plugin/issues/275
    cssLoader = {
      test: helpers.pathRegEx(/\.(<%= cssExtensions %>)$/),
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!postcss-loader' + helpers.getLoaderQueryStr('<%- cssLoaderName %>', cssLoaderOptions),
        publicPath: '../'   // This is relative to 'extractCSSTextPlugin.filename' below.
      })
    };

    // For any entry-point CSS file definitions, extract them as text files as well
    let extractCSSTextPlugin = new ExtractTextPlugin({
      filename: 'css/[name].[contenthash:8].css',     // This affects the cssLoader.loader.publicPath (see above)
      allChunks: true
    });
    config.plugins.push(extractCSSTextPlugin);
  }
  config.module.rules.push(cssLoader);
  /* **/
