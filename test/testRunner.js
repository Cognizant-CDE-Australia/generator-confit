'use strict';

var childProc = require('child_process');
var fs = require('fs-extra');
var path = require('path');
var colours = require('colors');

var PROTRACTOR_CMD = 'node_modules/protractor/bin/protractor test/protractor.conf.js ';


function main() {
  var fixtures = getFixtures(path.join(__dirname, 'fixtures/'));

  // Now, for each fixture file, run protractor
  //node_modules/protractor/bin/protractor test/protractor.conf.js --params.fixture=webpack-sass-es6.json

  fixtures.forEach(function(fixture) {
    console.info('\n' + ('CONFIT: '.bold + 'Running test for ' + fixture.bold).green.underline.bgBlack);
    childProc.execSync(PROTRACTOR_CMD + ' --params.fixture=' + fixture, {
      stdio: 'inherit'    // send the child console output to the parent process (us)
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
