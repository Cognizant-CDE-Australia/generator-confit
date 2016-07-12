'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'release';

describe('Release Generator', () => {

  it('should generate a pre-push hook', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-conventional-commit.json',
      function before() {
        yoassert.noFile(['package.json']);
      },
      function after() {
        yoassert.file(['package.json']);

        // There should also be some configuration in package.json/config
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.config.ghooks['pre-push'], 'npm-run-all verify test:unit:once --silent');

        done();
      }
    ).withPrompts({
      repositoryType: 'Other',
      useSemantic: false,
      commitMessageFormat: 'Conventional'
    });
  });

  it('should generate a commit message template and a hook when using conventional commit messages', (done) => {
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

        assert.equal(pkg.config.commitizen.path, 'node_modules/cz-customizable');
        assert.equal(pkg.config['cz-customizable'].config, 'config/release/commitMessageConfig.js');
        assert.equal(pkg.config.ghooks['commit-msg'], './node_modules/cz-customizable-ghooks/index.js $2');
        assert.equal(pkg.config.ghooks['pre-push'], 'npm-run-all verify test:unit:once --silent');

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

        assert.equal(pkg.config.commitizen, undefined);
        assert.equal(pkg.config['cz-customizable'], undefined);
        assert.equal(pkg.config.ghooks['commit-msg'], undefined);

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
