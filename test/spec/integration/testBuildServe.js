'use strict';

const assert = require('assert');
const server = require('./server');
const childProc = require('child_process');
const tempTestDir = process.env.TEST_DIR;
const fs = require('fs-extra');

const CONFIT_CMD = 'npm run build:serve';


function runBrowserTest(baseUrl) {
  console.info('Protractor baseUrl is', baseUrl);

  let proc = childProc.spawnSync('npm', ['run', 'test:browser', '--', '--baseUrl', baseUrl], {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR
  });

  if (proc.status !== 0) {
    throw new Error('' + proc.error);
  }
}


module.exports = function(confitConfig, SERVER_MAX_WAIT_TIME) {

  describe('npm run build:serve', () => {

    let baseUrl;

    before(() => {
      // Determine if we are dealing with the grunt server, or the NPM server
      const pkg = fs.readJsonSync(tempTestDir + 'package.json');
      let serverStartedRegEx;
      let configFn;
      let configData;

      if (pkg.scripts['serve:prod:https']) {
        configFn = modifyPackageServerConfig;
        configData = 'serve:prod';
        serverStartedRegEx = /Serving .* at http(s)?:\/\//;
      } else {
        configFn = modifyConfitServerConfig;
        configData = 'serverProd';
        serverStartedRegEx = /Started connect web server on/;
      }

      // Start up the confit PROD webserver
      return server.start(CONFIT_CMD, tempTestDir, configData, serverStartedRegEx, SERVER_MAX_WAIT_TIME, configFn).then(
        function success(result) {
          baseUrl = result.baseUrl;
        },
        function error(result) {
          console.error(result);
        }
      );
    });

    it('should start a webserver and build the sampleApp correctly', () => {
      assert.ok(baseUrl, 'baseUrl should be defined, server took too long to load.');
      assert.doesNotThrow(() => runBrowserTest(baseUrl));
    });

    after(() => server.stop());
  });
};


function modifyConfitServerConfig(testDir, port, configData) {
  // Once we have the port, MODIFY the confit.serverDEV configuration, then start the server
  let confitJson = fs.readJsonSync(testDir + 'confit.json');
  let server = confitJson['generator-confit'][configData];

  server.port = port;
  fs.writeJsonSync(testDir + 'confit.json', confitJson);

  return {
    baseUrl: server.protocol + '://' + server.hostname + ':' + server.port,
    details: server
  };
}

function modifyPackageServerConfig(testDir, port, configData) {
  // Once we have the port, MODIFY the confit.serverDEV configuration, then start the server
  const pkg = fs.readJsonSync(testDir + 'package.json');

  pkg.scripts[configData + ':https'] = pkg.scripts[configData + ':https'].replace(/-p \d*/, '-p ' + port);
  pkg.scripts[configData + ':http'] = pkg.scripts[configData + ':http'].replace(/-p \d*/, '-p ' + port);
  fs.writeJsonSync(testDir + 'package.json', pkg);

  return modifyConfitServerConfig(testDir, port, 'serverProd');
}
