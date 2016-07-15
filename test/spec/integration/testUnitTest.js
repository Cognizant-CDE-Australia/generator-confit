'use strict';

const assert = require('assert');
const childProc = require('child_process');
const fs = require('fs-extra');

const FIXTURE_DIR = __dirname + '/fixtures/';

// Pass the confit config to this module... (use module.exports

function runCommand(cmd) {
  // If there is an error, an exception will be thrown
  return childProc.execSync(cmd, {
    //stdio: 'inherit', // Don't send output to the parent, return it to the callee instead (so that tests can check the output)
    cwd: process.env.TEST_DIR
  });
}


module.exports = function(confitConfig, unitTestPath, commandToRun) {

  describe(commandToRun, () => {

    it('should pass the unit tests in the sampleApp code', function() {
      assert.doesNotThrow(() => runCommand(commandToRun));
    });

    // We get a table of results like this, which we need to filter to find 'All  files
    //----------------|----------|----------|----------|----------|----------------|
    //File            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
    //----------------|----------|----------|----------|----------|----------------|
    //demoModule/    |    80.95 |      100 |    33.33 |    76.47 |                |
    //app.js        |    78.57 |      100 |       25 |    72.73 |       15,26,27 |
    //demoModule.js |    85.71 |      100 |       50 |    83.33 |              9 |
    //----------------|----------|----------|----------|----------|----------------|
    //All files       |    80.95 |      100 |    33.33 |    76.47 |                |
    //----------------|----------|----------|----------|----------|----------------|

    it('should have 100% branch coverage for the test files', () => {
      let result = runCommand(commandToRun).toString();

      console.log(result);
      let results = result.split('\n');
      let fileLine = results.filter(item => item.indexOf('app.') >= 0 || item.indexOf('index.') >= 0);

      console.log(fileLine);

      let summaryLine = results.filter(item => item.indexOf('All files') === 0);

      assert(summaryLine.length === 1, 'Summary line array contains 1 item');

      let summaryParts = summaryLine[0].split('|');

      assert(summaryParts[0].indexOf('All files') === 0);
      assert(parseFloat(summaryParts[2], 10) > 50, 'Branches have greater than 50% coverage');
    });


    describe('with a unit test that finds a failure', function() {
      let jsFixtureFile = 'unitTest-fail.js';   // If this file is named 'unitTest-fail.spec.js', Mocha will try to run it as a unit/integration test!
      let destFixtureFile = unitTestPath + jsFixtureFile;

      before(function() {
        // Need to create a JS AND TypeScript version of this spec
        fs.copySync(FIXTURE_DIR + jsFixtureFile, destFixtureFile.replace('.js', '.spec.js'));
        fs.copySync(FIXTURE_DIR + jsFixtureFile, destFixtureFile.replace('.js', '.spec.ts'));
      });

      after(function() {
        fs.removeSync(destFixtureFile.replace('.js', '.spec.js'));
        fs.removeSync(destFixtureFile.replace('.js', '.spec.ts'));
      });


      it('should throw an error when a test has failed', function() {
        assert.throws(() => runCommand(commandToRun), Error);
      });
    });
  });
};
