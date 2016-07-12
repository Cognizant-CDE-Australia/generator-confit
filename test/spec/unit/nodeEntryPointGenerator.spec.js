'use strict';
const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'entryPoint';

describe('Node EntryPoint Generator', () => {

  it('should should generate a default "main" entry in package.json for an ES6 sourceType', function(done) {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-entryPoint-ES6-config.json',
      function before() {
        let confit = fs.readJsonSync('confit.json');
        let entryPoint = confit['generator-confit'].entryPoint.entryPoints;

        assert.equal(entryPoint, undefined);
      },
      function after() {
        yoassert.file(['confit.json', 'package.json']);

        let confit = fs.readJsonSync('confit.json');
        let config = confit['generator-confit'];
        let entryPoint = config.entryPoint.entryPoints;
        let epPath = config.paths.input.srcDir + 'index.js';
        let pkg = fs.readJsonSync('package.json');

        assert.equal(entryPoint.main[0], epPath);
        assert.equal(pkg.main, epPath);
        done();
      }
    ).withPrompts({
      entryPoints: {}
    });
  });


  it('should should generate a default "main" entry in package.json for a Typescript sourceType', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-entryPoint-TypeScript-config.json',
      function before() {
        let confit = fs.readJsonSync('confit.json');
        let entryPoint = confit['generator-confit'].entryPoint.entryPoints;

        assert.equal(entryPoint, undefined);
      },
      function after() {
        yoassert.file(['confit.json', 'package.json']);

        let confit = fs.readJsonSync('confit.json');
        let config = confit['generator-confit'];
        let entryPoint = config.entryPoint.entryPoints;
        let epPath = config.paths.input.srcDir + 'index.ts';
        let pkg = fs.readJsonSync('package.json');

        assert.equal(entryPoint.main[0], epPath);
        assert.equal(pkg.main, epPath);
        done();
      }
    ).withPrompts({
      entryPoints: {}
    });
  });


  it('should be changed by the sampleApp generator to point to the sampleApp entry point', (done) => {
    utils.runGenerator(
      'sampleApp',
      'node-entryPoint-sampleApp-config.json',
      function before() {},
      function after() {
        yoassert.file(['confit.json']);

        let confit = fs.readJsonSync('confit.json');
        let config = confit['generator-confit'];
        let entryPoint = config.entryPoint.entryPoints;
        let epPath = config.paths.input.srcDir + 'demo/index.js';

        assert.equal(entryPoint.main[0], epPath);
        done();
      }
    ).withPrompts({
      createSampleApp: true
    });
  });
});
