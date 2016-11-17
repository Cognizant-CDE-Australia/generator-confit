'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const GENERATOR_UNDER_TEST = 'testUnit';


describe('testUnit Generator', () => {
  it('should generate test config when there are no test dependencies due to a JS framework', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testUnit-no-test-deps.json',
      utils.noop,
      function after() {
        yoassert.file(['confit.yml']);
        let confit = yaml.load(fs.readFileSync('confit.yml'));

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
        // Confit.yml should now have an angular-mocks reference
        yoassert.file(['confit.yml']);
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let testDeps = confit['generator-confit'].testUnit.testDependencies;

        assert.equal(testDeps.length, 2);
        assert.equal(testDeps[0], 'angular');
        assert.equal(testDeps[1], 'angular-mocks');
        // assert.equal(testDeps[2], '@types/angular');
        // assert.equal(testDeps[3], '@types/angular-mocks');

        // And package.json should have a new dependency
        yoassert.file(['package.json']);
        let pkg = fs.readJsonSync('package.json');

        assert.ok(pkg.devDependencies['angular-mocks'], 'Dev dependency exists');

        done();
      }
    );
  });
});
