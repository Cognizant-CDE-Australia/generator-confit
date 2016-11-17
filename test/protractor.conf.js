'use strict';

exports.config = {
  // ChromeDriver location is used to help the standalone Selenium Server
  // find the chromedriver binary. This will be passed to the Selenium jar as
  // the system property webdriver.chrome.driver. If null, Selenium will
  // attempt to find ChromeDriver using PATH.
  chromeDriver: '../node_modules/protractor/selenium/chromedriver',
  directConnect: true,

  capabilities: {
    browserName: 'firefox',
  },

  framework: 'jasmine2',

  // The default Base URL.  This can be overridden on the command line: --baseUrl=https://hostname:port/path
  baseUrl: 'https://localhost:9999',

  // Selector for the element housing the angular app
  rootElement: 'html',

  exclude: [],

  plugins: [],

  // Alternatively, suites may be used. When run without a command line
  // parameter, all suites will run. If run with --suite=smoke or
  // --suite=smoke,full only the patterns matched by the specified suites will
  // run.
  suites: {
    app: 'protractorSpec/testApp.spec.js',
  },

  reportWriters: [
    function jUnitReporter(confitFixtureFileName) {
      let JasmineReporters = require('jasmine-reporters');
      let path = require('path');

      jasmine.getEnv().addReporter(new JasmineReporters.JUnitXmlReporter({
        savePath: path.join(__dirname, '/../reports/e2e'),
        filePrefix: 'junit-' + confitFixtureFileName + '-',
        consolidateAll: false,
      }));
    },
    function consoleReporter() {
      let SpecReporter = require('jasmine-spec-reporter');

      jasmine.getEnv().addReporter(new SpecReporter({
        displayStacktrace: true,
        displaySpecDuration: true,
      }));
    },
  ],


  onPrepare: function() {
    // Turn off the angular-sync part-of-protractor, as we are using protractor in a generic way
    browser.ignoreSynchronization = true;

    return browser.getProcessedConfig().then(function(config) {
      // Attach the reporters
      config.reportWriters.forEach(function(fn) {
        fn(process.env.FIXTURE);
      });
    });
  },

  // A callback function called once tests are finished.
  onComplete: function() {
    // At this point, tests will be done but global objects will still be
    // available.
  },

  // A callback function called once the tests have finished running and
  // the WebDriver instance has been shut down. It is passed the exit code
  // (0 if the tests passed or 1 if not). This is called once per capability.
  onCleanUp: function() {},


  // ----- Options to be passed to minijasminenode -----
  jasmineNodeOpts: {
    // onComplete will be called just before the driver quits.
    onComplete: null,
    // If true, display spec names.
    isVerbose: true,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 20000,
    // Remove Jasmine's 'dots' console reporter
    print: function() {},
  },
};
