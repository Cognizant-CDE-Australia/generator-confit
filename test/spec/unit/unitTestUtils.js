'use strict';

const path = require('path');
const helpers = require('yeoman-test');
const fs = require('fs-extra');

module.exports = {
  noop: function() {},
  runGenerator: runGenerator
};

function runGenerator(generatorName, confitFixture, beforeTestCb, assertionCb) {
  var generatorName = path.join(__dirname, '../../../generators/' + generatorName);
  var testDir;

  return helpers.run(generatorName)
    .inTmpDir(function (dir) {
      // Copy the confit.json fixture here
      if (confitFixture) {
        fs.copySync(path.join(__dirname, confitFixture), path.join(dir, 'confit.json'));
      }
      testDir = dir;
      beforeTestCb(testDir);
    })
    .withArguments(['--force=true'])    // Any file-conflicts, over-write
    //.withGenerators(generators)
    .withOptions({
      skipInstall: true,
      skipRun: true
    })
    .on('end', function() {
      assertionCb(testDir);
    });
}
