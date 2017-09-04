'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const GENERATOR_UNDER_TEST = 'testUnit';


describe('testUnit Generator', () => {
  /**
   * Boilerplate test-harness for testUnit generator
   * @param {function} done
   * @param {string} confitInputFile
   * @param {function} assertions
   * @param {string} expectedFramework
   * @param {string[]} expectedTestDependencies
   * @return {GeneratorHelper}
   */
  function runGenerator(done, {confitInputFile = 'testUnit-no-test-deps.json', expectedFramework, expectedTestDependencies = []}, assertions = () => {}) {
    return utils.runGenerator(
      GENERATOR_UNDER_TEST,
      confitInputFile,
      utils.noop,
      function after() {
        yoassert.file(['confit.yml']);
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let testUnitConfig = confit['generator-confit'].testUnit;

        assert.equal(testUnitConfig.testFramework, expectedFramework);
        assert.equal(testUnitConfig.testDependencies.length, expectedTestDependencies.length);

        // additional assertions
        assertions();

        done();
      }
    );
  }

  it('should generate test config for browser projects with a default testFramework and no dependencies', (done) => {
    runGenerator(done, {expectedFramework: 'jasmine', expectedTestDependencies: []}, () => yoassert.noFile(['package.json']));
  });

  it('should generate test config for node projects with a default testFramework and no dependencies', (done) => {
    runGenerator(done, {confitInputFile: 'node-testUnit.json', expectedFramework: 'mocha', expectedTestDependencies: []}, () => yoassert.noFile(['package.json']));
  });


  it('should generate test config for browser projects with a specified testFramework and no dependencies', (done) => {
    runGenerator(done, {expectedFramework: 'mocha', expectedTestDependencies: []}, () => yoassert.noFile(['package.json']))
      .withPrompts({
        'testFramework': 'mocha',
      });
  });


  it('should generate test dependencies when there are IS a JS framework which has test dependencies', (done) => {
    runGenerator(done, {
      confitInputFile: 'testUnit-framework-with-test-deps.json',
      expectedFramework: 'jasmine',
      expectedTestDependencies: ['angular', 'angular-mocks'],
    }, () => {
      yoassert.file(['package.json']);
      let pkg = fs.readJsonSync('package.json');

      assert.ok(pkg.devDependencies['angular-mocks'], 'Dev dependency exists');
    });
  });
});
