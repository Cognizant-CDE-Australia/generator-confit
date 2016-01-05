'use strict';

var childProc = require('child_process');
var fs = require('fs-extra');
var path = require('path');
var colours = require('colors');

var PROTRACTOR_CMD = 'node_modules/protractor/bin/protractor';


function main() {
  var fixtures = getFixtures(path.join(__dirname, 'fixtures/'));
  var procCount = 0;
  var procComplete = 0;
  var procSuccess = 0;

  // Now, for each fixture file, run protractor
  fixtures.forEach(function(fixture) {
    console.info('\n' + ('CONFIT: '.bold + 'Running test for ' + fixture.bold).green.underline.bgBlack);
    var proc = childProc.spawn(PROTRACTOR_CMD, ['test/protractor.conf.js', '--params.fixture=' + fixture], {
      stdio: 'inherit'    // send the child console output to the parent process (us)
    });
    procCount++;

    proc.on('close', function(code) {
      procComplete++;
      var isSuccess = (code === 0);
      procSuccess += (code === 0) ? 1 : 0;
      console.info('\n' + ('CONFIT'.green.underline + (': Executed ' + procComplete + ' of ' + procCount + ' specs ').white + (isSuccess ? 'SUCCESS'.green.bold : 'FAILED'.red.bold)).bgBlack);

      if (procComplete === procCount) {
        console.info('\n' + ('CONFIT Test Result:'.green.underline + ' ' + (procCount === procSuccess ? 'SUCCESS'.green.bold : 'FAILED'.red.bold)).bgBlack);
        process.exit(0);
      }s
    });
  });
}

/**
 * Get a list of fixture files from a directory that do NOT start with _ but end with '.json'
 *
 * @param dir                 The directory to search
 * @returns {Array.<String>}  The list of files found that match the criteria
 */
function getFixtures(dir) {
  // Get a list of files that end in '.json' from the directory, that do not start with '_'
  var files = fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isFile() && (file.match(/^[^_]+\.json$/) !== null);
    });
  return files;
}


main();
