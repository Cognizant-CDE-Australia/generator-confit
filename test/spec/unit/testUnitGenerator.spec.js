'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var yoassert = require('yeoman-assert');
var assert = require('assert');
var fs = require('fs-extra');


function runGenerator(confitFixture, assertionCb) {
  var generatorName = path.join(__dirname, '../../../generators/testUnit');
  helpers.run(generatorName)
    .inTmpDir(function (dir) {
      // Copy the confit.json fixture here
      fs.copySync(path.join(__dirname, confitFixture), path.join(dir, 'confit.json'));
    })
    .withArguments(['--force=true'])    // Any file-conflicts, over-write
    .withGenerators([])
    .withOptions({
      skipInstall: true,
      skipRun: true
    })
    .on('end', function() {
      assertionCb();
    });
}


describe('testUnit Generator', function () {

  it('should generate test config when there are no test dependencies due to a JS framework', function(done) {
    runGenerator('fixtures/testUnit-no-test-deps.json', function() {
      yoassert.file(['confit.json']);
      var confit = fs.readJsonSync('confit.json');
      assert.equal(confit['generator-confit'].testUnit.testDependencies.length, 0);

      // Package.json is not even created
      yoassert.noFile(['package.json']);
      done();
    });
  });


  it('should generate test dependencies when there are IS a JS framework which has test dependencies', function(done) {
    runGenerator('fixtures/testUnit-framework-with-test-deps.json', function() {
      // Confit.json should now have an angular-mocks reference
      yoassert.file(['confit.json']);
      var confit = fs.readJsonSync('confit.json');
      assert.equal(confit['generator-confit'].testUnit.testDependencies.length, 2);
      assert.equal(confit['generator-confit'].testUnit.testDependencies[0], 'angular');
      assert.equal(confit['generator-confit'].testUnit.testDependencies[1], 'angular-mocks');

      // And package.json should have a new dependency
      yoassert.file(['package.json']);
      var pkg = fs.readJsonSync('package.json');
      assert.ok(pkg.devDependencies['angular-mocks'], 'Dev dependency exists');

      // Typings.json could be changed if there is a typelib defined
      done();
    });
  });

});
