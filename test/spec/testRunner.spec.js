'use strict';

var assert = require('assert');

describe('Confit test', function() {
  var fixtures = getFixtures(path.join(__dirname, '../fixtures/'));

  // The set of tests to run for each fixture:
  var runDevSpec = require('./testDev');




  fixtures.forEach(function(fixture) {

    describe(fixture, function() {

      // Run this block ONCE per fixture
      before(function() {
        // install confit
        console.log('installing confit to ' + fixture + '(should happen once)');
      });

      runDevSpec();
    });
  });

  

});


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
