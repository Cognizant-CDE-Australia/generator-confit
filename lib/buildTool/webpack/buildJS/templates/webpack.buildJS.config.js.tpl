  /** JS START */
  <%
  var sourceFormat = buildJS.sourceFormat;
  var outputFormat = buildJS.outputFormat;
  var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
  var srcDirRegEx = new RegExp(paths.input.srcDir.replace(/\//g, '\\/') + '.*\\.(' + jsExtensions.join('|') + ')$');
  var selectedFramework = buildJS.framework[0] || '';
  var jsLoaders = [];


  if (sourceFormat === 'ES6') {
    jsLoaders.push({
      loader: 'babel-loader',
      options: {
        // https://github.com/babel/babel-loader#options
        cacheDirectory: true,
      }
    });
  }

  if (sourceFormat === 'TypeScript') {
    jsLoaders.push({ loader: 'awesome-typescript-loader' });
  %>

  /*
   * Plugin: ForkCheckerPlugin
   * Description: Do type checking in a separate process, so webpack don't need to wait.
   *
   * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
   */
  const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
  config.plugins.push(new CheckerPlugin());

  <%
  }

  if (selectedFramework === 'AngularJS 2.x') {
    jsLoaders.push({ loader: 'angular2-template-loader' });
  %>
  /**
   * Plugin: ContextReplacementPlugin
   * Description: Provides context to Angular's use of System.import
   *
   * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
   * See: https://github.com/angular/angular/issues/11580
   */
  const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
  config.plugins.push(
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('<%- paths.input.srcDir %>') // location of your src
    )
  );
  <% } %>

  let srcLoader = {
    test: helpers.pathRegEx(<%= srcDirRegEx.toString() %>),
    use: <%- printJson(jsLoaders, 4) %>,
    exclude: moduleDirectories    // There should be no need to exclude unit or browser tests because they should NOT be part of the source code dependency tree
  };
  config.module.rules.push(srcLoader);

  /* **/
