'use strict';

const assert = require('assert');
const server = require('./server');
const childProc = require('child_process');
const tempTestDir = process.env.TEST_DIR;
const fs = require('fs-extra');
const yaml = require('js-yaml');

/**
 * Runs Protractor tests inside a browser
 * @param {url} baseUrl   The URL of the website that is being tested
 */
function runSystemTest(baseUrl) {
  console.info('Protractor baseUrl is', baseUrl);

  let proc = childProc.spawnSync('npm', ['run', 'test:system', '--', '--baseUrl', baseUrl], {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR,
  });

  if (proc.status !== 0) {
    throw new Error(String(proc.error));
  }
}


module.exports = function(confitConfig, SERVER_MAX_WAIT_TIME) {
  describe('npm run dev', () => {
    let baseUrl;

    before(() => {
      // Determine if we are dealing with the NPM server or not
      const pkg = fs.readJsonSync(tempTestDir + 'package.json');
      let serverStartedRegEx;
      let configFn;
      let configData;

      if (pkg.scripts['serve:dev:https']) {
        configFn = modifyPackageServerConfig;
        configData = 'serve:dev';
        serverStartedRegEx = /Serving .* at http(s)?:\/\//;
      } else {
        configFn = modifyConfitServerConfig;
        configData = 'serverDev';
        serverStartedRegEx = /webpack\: Compiled/;
      }

      // Start up the confit DEV webserver
      return server.start('npm start', tempTestDir, configData, serverStartedRegEx, SERVER_MAX_WAIT_TIME, configFn).then(function success(result) {
        baseUrl = result.baseUrl;
      });
    });

    it('should start a webserver and build the sampleApp correctly', function() {
      assert.doesNotThrow(() => runSystemTest(baseUrl));
    });

    after(function() {
      server.stop();
    });
  });
};

/**
 * Helper function to modify the Confit.serverDEV/PROD config as it changes before each test
 * @param {string} testDir                      Test directory where Confit file is located
 * @param {number} port                         Port number of server
 * @param {Object} configData                   serverDEV or ServerPROD
 * @return {{baseUrl: string, details: Object}} Server configuration info
 */
function modifyConfitServerConfig(testDir, port, configData) {
  // Once we have the port, MODIFY the confit.serverDEV configuration, then start the server
  let confitData = yaml.load(fs.readFileSync(testDir + 'confit.yml'));
  let server = confitData['generator-confit'][configData];

  server.port = port;
  fs.writeFileSync(testDir + 'confit.yml', yaml.dump(confitData));

  return {
    baseUrl: server.protocol + '://' + server.hostname + ':' + server.port,
    details: server,
  };
}

/**
 * Helper function to modify the package.json config as well as the confit.yml config as it changes before each test
 * @param {string} testDir                      Test directory where Confit file is located
 * @param {number} port                         Port number of server
 * @param {Object} configData                   serverDEV or ServerPROD
 * @return {{baseUrl: string, details: Object}} Server configuration info
 */
function modifyPackageServerConfig(testDir, port, configData) {
  // Once we have the port, MODIFY the confit.serverDEV configuration, then start the server
  const pkg = fs.readJsonSync(testDir + 'package.json');

  pkg.scripts[configData + ':https'] = pkg.scripts[configData + ':https'].replace(/-p \d*/, '-p ' + port);
  pkg.scripts[configData + ':http'] = pkg.scripts[configData + ':http'].replace(/-p \d*/, '-p ' + port);
  fs.writeJsonSync(testDir + 'package.json', pkg);

  return modifyConfitServerConfig(testDir, port, 'serverProd');
}
