const frameworks = {
  'AngularJS 1.x': {
    helperName: 'Protractor',
    helperConfig: {
      rootElement: 'html',
      windowSize: '1280x840',
      seleniumAddress: undefined
    }
  },
  'AngularJS 2.x': {
    helperName: 'Protractor',
    helperConfig: {
      rootElement: 'app',
      useAllAngular2AppRoots: true,
      windowSize: '1280x840',
      seleniumAddress: undefined
    }
  },
  'React (latest)': {
    helperName: 'WebDriverIO',
    helperConfig: {}
  },
  'default': {
    helperName: 'WebDriverIO',
    helperConfig: {}
  }
};


exports.getHelper = ({framework = 'default', headless = false, config}) => {
  const commonConfig = {
    browser: 'chrome',
    driver: 'local',
    restart: false,
    directConnect: true,
    timeouts: {
      script: 60000,
      'page load': 10000,
    }
  };

  let selectedFramework = frameworks[framework];
  let helperName = selectedFramework.helperName;
  let helperConfig = {
    [helperName]: Object.assign(commonConfig, selectedFramework.helperConfig, config)
  };

  if (headless) {
    helperConfig[helperName].browser = 'chrome';
    helperConfig[helperName].capabilities = {
      chromeOptions: {
        // --allow-insecure-localhost is needed when using SSL on localhost. Lands in Chrome 62. See https://bugs.chromium.org/p/chromium/issues/detail?id=721739
        args: ['--allow-insecure-localhost', '--headless', '--disable-gpu', '--window-size=1024,768']
      }
    };
  }

  return helperConfig;
}

