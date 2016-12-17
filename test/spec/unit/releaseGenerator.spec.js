'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'release';

describe('Release Generator', () => {
  it('should not generate a pre-push hook when checkCodeCoverage is false', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-other-repo-conventional-commit.json',
      function before() {
        yoassert.noFile(['package.json']);
      },
      function after() {
        yoassert.file(['package.json']);

        // There should also be some configuration in package.json/config
        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.config.ghooks['commit-msg'], 'node ./node_modules/cz-customizable-ghooks/lib/index.js $2');
        assert.equal(pkg.config.ghooks['pre-push'], undefined);

        done();
      }
    ).withPrompts({
      useSemantic: false,
      commitMessageFormat: 'Conventional',
      checkCodeCoverage: false,
    });
  });


  it('should generate a commit message template and a hook when using conventional commit messages and a pre-push hook when checkCodeCoverage is true', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-other-repo-conventional-commit.json',
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
        assert.equal(pkg.config.ghooks['commit-msg'], 'node ./node_modules/cz-customizable-ghooks/lib/index.js $2');
        assert.equal(pkg.config.ghooks['pre-push'], 'npm-run-all verify test:coverage --silent');

        done();
      }
    ).withPrompts({
      useSemantic: false,
      commitMessageFormat: 'Conventional',
      checkCodeCoverage: true,
    });
  });


  it('should NOT generate a commit message template when NOT using conventional commit messages', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-other-repo-conventional-commit.json',
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
        assert.equal(pkg.config.ghooks['pre-push'], 'npm-run-all verify test:coverage --silent');

        done();
      }
    ).withPrompts({
      useSemantic: false,
      commitMessageFormat: 'None',
      checkCodeCoverage: true,
    });
  });


  it('should generate a "release" and a "semantic-release" script for semantic releases', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-other-repo-conventional-commit.json',
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
      useSemantic: true,
      commitMessageFormat: 'Conventional',
    });
  });


  it('should generate only a "release" script for non-semantic releases', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-other-repo-conventional-commit.json',
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
      useSemantic: false,
      commitMessageFormat: 'Conventional',
    });
  });


  it('should generate a "pre-release" script for non-semantic releases on GitHub and does not use the semantic-release-cli module', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-github-repo-conventional-commit.json',
      function before() { },
      function after() {
        yoassert.file(['package.json']);

        // And there should be some scripts
        let pkg = fs.readJsonSync('package.json');

        assert(pkg.scripts['pre-release'].length > 0, 'scripts.release exists');
        assert(pkg.scripts['semantic-release'] === undefined, 'scripts.semantic-release does not exist');

        done();
      }
    ).withPrompts({
      useSemantic: false,
      commitMessageFormat: 'Conventional',
    });
  });


  it('should generate a "pre-release" script for semantic releases on GitHub and use semantic-release-cli module', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'release-github-repo-conventional-commit.json',
      function before() { },
      function after(/* testDir*/) {
        yoassert.file(['package.json']);
        // fs.readdirSync(testDir).forEach(file => console.log(file));

        // And there should be some scripts
        let pkg = fs.readJsonSync('package.json');

        assert(pkg.scripts['pre-release'].length > 0, 'scripts.release exists');
        assert(pkg.scripts['semantic-release'] === undefined, 'scripts.semantic-release does not exist');
        // This package is scheduled to be installed globally, so it doesn't show up in the dependency list
        // assert(pkg.devDependencies['semantic-release-cli'] !== undefined, 'semantic-release-cli package exists');
        done();
      }
    ).withPrompts({
      useSemantic: true,
      commitMessageFormat: 'Conventional',
    });
  });
});
