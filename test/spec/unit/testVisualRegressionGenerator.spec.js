'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const GENERATOR_UNDER_TEST = 'testVisualRegression';


describe('Visual Regression Test Generator', () => {
  it('should should generate default config values', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testVisualRegression-config.yml',
      function before() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].testVisualRegression;

        assert.equal(config, undefined);
      },
      function after() {
        yoassert.file(['confit.yml', 'package.json', 'config/testVisualRegression/backstop.config.js']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].testVisualRegression;

        assert.equal(config.enabled, true);
        assert.equal(config.moduleTestDir, 'visualTest/');
        assert.equal(config.referenceImageDir, 'visualRegressionTest/referenceImages/');

        // The package.json file should have visual regression test commands
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts['test:visual'], 'cd node_modules/backstopjs && npm run test -- --configPath=../../config/testVisualRegression/backstop.config.js');
        assert.equal(pkg.scripts['test:visual:ref'], 'cd node_modules/backstopjs && npm run reference -- --configPath=../../config/testVisualRegression/backstop.config.js');

        done();
      }
    );
  });


  it('should not ask for extra values when the user does not want documentation', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testVisualRegression-config.yml',
      function before() {},
      function after() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].testVisualRegression;

        assert.equal(config.enabled, false);
        assert.equal(config.moduleTestDir, undefined);
        assert.equal(config.referenceImageDir, undefined);

        // assert that the configuration file does not exist
        yoassert.noFile(['config/testVisualRegression/backstop.config.js']);

        done();
      }
    ).withPrompts({
      enabled: false
    });
  });


  it('should allow the default values to be changed', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testVisualRegression-config.yml',
      function before() {},
      function after() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].testVisualRegression;

        assert.equal(config.enabled, true);
        assert.equal(config.moduleTestDir, 'a/b/c/');
        assert.equal(config.referenceImageDir, 'magic-johnson/');

        done();
      }
    ).withPrompts({
      enabled: true,
      moduleTestDir: 'a/b/c',
      referenceImageDir: 'magic-johnson/'
    });
  });



  it('should convert invalid paths into valid paths', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testVisualRegression-config.yml',
      function before() {},
      function after() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let config = confit['generator-confit'].testVisualRegression;

        assert.equal(config.moduleTestDir, 'dotSlash/');
        assert.equal(config.referenceImageDir, 'visualRegressionTest/referenceImages/');        // Changed to the default
        done();
      }
    ).withPrompts({
      enabled: true,
      moduleTestDir: './dotSlash/',
      referenceImageDir: '   '
    });
  });


  it('should throw an error if a path contains ../', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testVisualRegression-config.yml',
      function before() {},
      function after() {},
      function error(err) {
        assert.equal(err.message, '"moduleTestDir" cannot contain "../"');
        done();
      }
    ).withPrompts({
      moduleTestDir: 'a/../b//c/d'
    });
  });


  it('should throw an error if a path is an absolute path', done => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'testVisualRegression-config.yml',
      function before() {},
      function after() {},
      function error(err) {
        assert.equal(err.message, '"referenceImageDir" cannot be an absolute path: /full/path/dir');
        done();
      }
    ).withPrompts({
      referenceImageDir: '/full/path/dir'
    });
  });
});
