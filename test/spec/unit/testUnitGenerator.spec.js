'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'testUnit';


describe('testUnit Generator', () => {

  it('should generate test config when there are no test dependencies due to a JS framework', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testUnit-no-test-deps.json',
      utils.noop,
      function after() {
        yoassert.file(['confit.json']);
        let confit = fs.readJsonSync('confit.json');

        assert.equal(confit['generator-confit'].testUnit.testDependencies.length, 0);

        // Package.json is not even created
        yoassert.noFile(['package.json']);
        done();
      }
    );
  });


  it('should generate test dependencies when there are IS a JS framework which has test dependencies', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testUnit-framework-with-test-deps.json',
      utils.noop,
      function after() {
        // Confit.json should now have an angular-mocks reference
        yoassert.file(['confit.json']);
        let confit = fs.readJsonSync('confit.json');

        assert.equal(confit['generator-confit'].testUnit.testDependencies.length, 2);
        assert.equal(confit['generator-confit'].testUnit.testDependencies[0], 'angular');
        assert.equal(confit['generator-confit'].testUnit.testDependencies[1], 'angular-mocks');

        // And package.json should have a new dependency
        yoassert.file(['package.json']);
        let pkg = fs.readJsonSync('package.json');

        assert.ok(pkg.devDependencies['angular-mocks'], 'Dev dependency exists');

        // Typings.json could be changed if there is a typelib defined
        done();
      }
    );
  });

});
