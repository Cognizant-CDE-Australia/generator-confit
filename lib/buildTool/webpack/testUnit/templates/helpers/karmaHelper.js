exports.getPlugins = (testFramework) => {
  const plugins = [
    'karma-chrome-launcher',
    'karma-coverage',
    'karma-remap-coverage',
    'karma-sourcemap-loader',
    'karma-webpack'
  ];

  const frameworkPlugins = {
    mocha: [
      ...plugins,
      'karma-mocha',
      'karma-chai',
      'karma-sinon'
    ],
    jasmine: [...plugins, 'karma-jasmine']
  };

  return frameworkPlugins[testFramework];
}
