'use strict';

var path = require('path');
var spawn = require('child_process').spawn;
var freeport = require('freeport');
var fs = require('fs-extra');
var child;


/**
 * Runs `npm start` which *should* create a webserver which runs forever.
 *
 * @param testDir             Where the test application is located (where to run `npm start`)
 * @param serverStartTimeout  The amount of time to wait before returning control to the parent program. Usually allow enough time
 * @returns {Promise}         Promise that is fullfilled once the server has started
 */
function startServer(testDir, serverStartTimeout) {
  var SERVER_STARTED_RE = /webpack: bundle is now VALID\.\n$/;    // A string to search for in the stdout, which indicates the server has started.
  var resolveFn, rejectFn;
  var serverPort;

  getFreePort().then(function(port) {
    serverPort = port;

    // Once we have the port, modify the confit.serverDEV configuration, then start the server
    var confitJson = fs.readJsonSync(testDir + 'confit.json');
    confitJson['generator-confit'].serverDev.port = port;
    fs.writeJsonSync(testDir + 'confit.json', confitJson);

    child = spawn('npm',['start'], {
      cwd: testDir,
      detached: true
    });

    child.on('exit', function(reason) {
      console.log('Server exited', reason);
    });

    child.on('error', function (err) {
      console.log('Failed to start server process.', err);
    });

    child.stdout.on('data', function (data) {
      console.info('Server: ' + data);
      // If we detect from the stdout that the server has started, resolve immediately
      var dataStr = '' + data;
      if (dataStr.match(SERVER_STARTED_RE)) {
        console.log('Server started!');
        resolveFn(serverPort);
      }
    });

    child.stderr.on('data', function (data) {
      console.error('' + data);
      //rejectFn('' + data);      // Webpack is logging the % complete on stderr!
    });
  }, function(err) {
    rejectFn(err);
  });


  return new Promise(function(resolve, reject) {
    resolveFn = resolve;
    rejectFn = reject;
    setTimeout(function() {
      console.log('Server: returning to parent...');
      resolveFn(serverPort);
    }, serverStartTimeout);
  });
}


function stopServer() {
  // Kills ALL CHILD PROCESSES (the only page on the internet that talks about this: http://azimi.me/2014/12/31/kill-child_process-node-js.html)
  process.kill(-child.pid);
}


function getFreePort() {
  return new Promise(function(resolve, reject) {
    freeport(function(err, port) {
      if (err) {
        reject(err);
      }
      resolve(port);
    });
  });
}


module.exports = {
  start: startServer,
  stop: stopServer
};
