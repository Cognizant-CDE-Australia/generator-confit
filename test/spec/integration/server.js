'use strict';

const spawn = require('child_process').spawn;
const freeport = require('freeport');
let child;

module.exports = {
  start: startServer,
  stop: stopServer
};

/*
 * Runs `npm start` which *should* create a webserver which runs forever.
 *
 * @param testDir             Where the test application is located (where to run `npm start`)
 * @param serverStartTimeout  The amount of time to wait before returning control to the parent program. Usually allow enough time
 * @returns {Promise}         Promise that is fullfilled once the server has started
 */
function startServer(cmd, testDir, confitServerToStart, regExForStdioToIndicateServerReady, serverStartTimeout, configFn) {
  let SERVER_STARTED_RE = regExForStdioToIndicateServerReady;    // A string to search for in the stdout, which indicates the server has started.
  let resolveFn, rejectFn;
  let result = {};
  let resolveCalled = false;

  getFreePort().then((port) => {
    result = configFn(testDir, port, confitServerToStart);

    let cmdParams = cmd.split(' ');
    let mainCmd = cmdParams.shift();

    child = spawn(mainCmd, cmdParams, {
      cwd: testDir,
      detached: true
    });

    child.on('exit', (reason) => {
      console.log('Server exited:', reason);
    });

    child.on('error', (err) => {
      console.log('Failed to start server process:', err);
    });

    child.stdout.on('data', (data) => {
      let dataStr = '' + data;

      console.info('Server: ' + dataStr);
      // If we detect from the stdout that the server has started, resolve immediately
      if (dataStr.match(SERVER_STARTED_RE)) {
        console.log('Server started!');
        resolveCalled = true;
        resolveFn(result);
      }
    });

    // Webpack is logging the %-complete on stderr! Filter out these messages
    let filterRE = /^\d*%/;

    child.stderr.on('data', (data) => {
      let msg = data.toString();

      if (filterRE.test(msg)) {
        console.error(msg);
      }
      //rejectFn('' + data);    // Don't reject these percentage complete messages
    });
  }, err => rejectFn(err));


  return new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;

    // If we timeout, still call the call rejectFn
    setTimeout(() => {
      let msg = `Server: Failed to start after ${serverStartTimeout}ms timeout`;

      if (!resolveCalled) {
        rejectFn(msg);
      }
    }, serverStartTimeout);
  });
}


function stopServer() {
  console.log('Stopping server...');
  // Kills ALL CHILD PROCESSES (the only page on the internet that talks about this: http://azimi.me/2014/12/31/kill-child_process-node-js.html)
  process.kill(-child.pid);
  console.log('...stopped');
}


function getFreePort() {
  return new Promise((resolve, reject) => {
    freeport((err, port) => {
      if (err) {
        reject(err);
      }
      resolve(port);
    });
  });
}
