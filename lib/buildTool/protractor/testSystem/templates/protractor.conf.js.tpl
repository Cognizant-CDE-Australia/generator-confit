'use strict';

// START_CONFIT_GENERATED_CONTENT
<%
var rootDir = (paths.config.configDir + resources.testSystem.configSubDir).replace(/(.+?\/)/g, '../');
// TODO: Add support for test specs written with non-JS extensions
-%>

var config = {
  // ChromeDriver location is used to help the standalone Selenium Server
  // find the chromedriver binary. This will be passed to the Selenium jar as
  // the system property webdriver.chrome.driver. If null, Selenium will
  // attempt to find ChromeDriver using PATH.
  chromeDriver: '<%= rootDir %>node_modules/protractor/selenium/chromedriver',
  directConnect: true,

  capabilities: {
    browserName: 'firefox' // chrome
  },

  framework: 'jasmine',

  // The default Base URL.  This can be overridden on the command line: --baseUrl=https://hostname:port/path
  baseUrl: '<%= serverDev.protocol %>://<%= serverDev.hostname %>:<%= serverDev.port %>/',

  // Selector for the element housing the angular app
  rootElement: 'html',

  exclude: [],

  plugins: [],

  // Alternatively, suites may be used. When run without a command line
  // parameter, all suites will run. If run with --suite=smoke or
  // --suite=smoke,full only the patterns matched by the specified suites will
  // run.
  suites: {
    app: '<%= rootDir + paths.input.modulesDir %>**/<%= paths.input.systemTestDir %>*.spec.js'
  },

  reportWriters: [
    function jUnitReporter(confitFixtureFileName) {
      var JasmineReporters = require('jasmine-reporters');
      jasmine.getEnv().addReporter(new JasmineReporters.JUnitXmlReporter({
        savePath: '<%= rootDir + paths.output.reportDir %>browser',
        filePrefix: 'junit-' + confitFixtureFileName + '-',
        consolidateAll: false
      }));
    },
    function consoleReporter() {
      var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
      jasmine.getEnv().addReporter(new SpecReporter({
        displayStacktrace: 'summary',
        displaySpecDuration: true
      }));
    }
  ],


  onPrepare: function() {
    <% var ignoreSync = !(buildJS.framework[0] && buildJS.framework[0].search('AngularJS 1.x') > -1); %>
    // Turn off the Angular-sync part-of-Protractor when not using AngularJS 1.x
    browser.ignoreSynchronization = <%= ignoreSync %>;

    return browser.getProcessedConfig().then(function(config) {
      // Attach the reporters
      config.reportWriters.forEach(function(fn) {
        fn();
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
    // If true, print colors to the terminal.
    showColors: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 20000,
    // Remove Jasmine's 'dots' console reporter
    print: function() {}
  }
};
// END_CONFIT_GENERATED_CONTENT

exports.config = config;
