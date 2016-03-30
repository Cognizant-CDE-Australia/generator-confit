'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'release';

describe('Release Generator', function () {

  it('should generate a commit message template when using conventional commit messages', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-conventional-commit.json',
      function before() {
        yoassert.noFile(['config/release/commitMessageConfig.js']);
      },
      function after() {
        yoassert.file(['config/release/commitMessageConfig.js']);
        yoassert.file(['package.json']);

        // There should also be some configuration in package.json/config
        let pkg = fs.readJsonSync('package.json');
        assert(pkg.config.commitizen.path === 'node_modules/cz-customizable');
        assert(pkg.config['cz-customizable'].config === 'config/release/commitMessageConfig.js');

        done();
      }
    ).withPrompts({
      repositoryType: 'Other',
      useSemantic: false,
      commitMessageFormat: 'Conventional'
    });
  });


  it('should NOT generate a commit message template when NOT using conventional commit messages', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-conventional-commit.json',
      function before() {
        yoassert.noFile(['config/release/commitMessageConfig.js']);
      },
      function after() {
        yoassert.noFile(['config/release/commitMessageConfig.js']);
        yoassert.file(['package.json']);

        // There should not be also be some configuration in package.json/config
        let pkg = fs.readJsonSync('package.json');
        assert(pkg.config === undefined);

        done();
      }
    ).withPrompts({
      repositoryType: 'Other',
      useSemantic: false,
      commitMessageFormat: 'None'
    });
  });


  it('should generate a "release" and a "semantic-release" script for semantic releases', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-conventional-commit.json',
      function before() { },
      function after() {
        yoassert.file(['package.json']);

        // And there should be some scripts
        let pkg = fs.readJsonSync('package.json');
        assert(pkg.scripts.release.length > 0, 'scripts.release exists');
        assert(pkg.scripts['semantic-release'].length > 0, 'scripts.semantic-release exists');

        done();
      }
    ).withPrompts({
      repositoryType: 'Other',
      useSemantic: true,
      commitMessageFormat: 'Conventional'
    });
  });


  it('should generate only a "release" script for non-semantic releases', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-conventional-commit.json',
      function before() { },
      function after() {
        yoassert.file(['package.json']);

        // And there should be some scripts
        let pkg = fs.readJsonSync('package.json');
        assert(pkg.scripts.release.length > 0, 'scripts.release exists');
        assert(pkg.scripts['semantic-release'] === undefined, 'scripts.semantic-release does not exist');

        done();
      }
    ).withPrompts({
      repositoryType: 'Other',
      useSemantic: false,
      commitMessageFormat: 'Conventional'
    });
  });

});
