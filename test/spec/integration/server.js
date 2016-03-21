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
function startServer(cmd, testDir, confitServerToStart, regExForStdioToIndicateServerReady, serverStartTimeout) {
  var SERVER_STARTED_RE = regExForStdioToIndicateServerReady;    // A string to search for in the stdout, which indicates the server has started.
  var resolveFn, rejectFn;
  var result = {};

  getFreePort().then(function(port) {
    // Once we have the port, MODIFY the confit.serverDEV configuration, then start the server
    var confitJson = fs.readJsonSync(testDir + 'confit.json');
    var server = confitJson['generator-confit'][confitServerToStart];
    server.port = port;
    fs.writeJsonSync(testDir + 'confit.json', confitJson);

    result = {
      baseUrl: server.protocol + '://' + server.hostname + ':' + server.port,
      details: server
    };

    var cmdParams = cmd.split(' ');
    var mainCmd = cmdParams.shift();

    child = spawn(mainCmd, cmdParams, {
      cwd: testDir,
      detached: true
    });

    child.on('exit', function(reason) {
      console.log('Server exited:', reason);
    });

    child.on('error', function (err) {
      console.log('Failed to start server process:', err);
    });

    child.stdout.on('data', function (data) {
      console.info('Server: ' + data);
      // If we detect from the stdout that the server has started, resolve immediately
      var dataStr = '' + data;
      if (dataStr.match(SERVER_STARTED_RE)) {
        console.log('Server started!');
        resolveFn(result);
      }
    });

    // Webpack is logging the % complete on stderr! Filter out these messages
    var filterRE = /^\d*%/;
    child.stderr.on('data', function (data) {
      var msg = data.toString();
      if (filterRE.test(msg)) {
        console.error(msg);
      }
      //rejectFn('' + data);
    });
  }, function(err) {
    rejectFn(err);
  });


  return new Promise(function(resolve, reject) {
    resolveFn = resolve;
    rejectFn = reject;
    setTimeout(function() {
      console.log('Server: returning to parent...');
      resolveFn(result);
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
