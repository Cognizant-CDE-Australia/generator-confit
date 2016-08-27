'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const GENERATOR_UNDER_TEST = 'documentation';

describe('Node Documentation Generator', () => {

  it('should should generate default documentation values when the project is not hosted on GitHub', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let documentation = confit['generator-confit'].documentation;

        assert.equal(documentation, undefined);
      },
      function after() {
        yoassert.file(['confit.yml']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let docConfig = confit['generator-confit'].documentation;

        assert.equal(docConfig.generateDocs, true);
        assert.equal(docConfig.srcDir, 'docs/');
        assert.equal(docConfig.outputDir, 'docs-website/');
        assert.equal(docConfig.publishMethod, 'manual');
        assert.equal(docConfig.createSampleDocs, true);
        done();
      }
    );
  });


  it('should should generate different default documentation values when the project is hosted on GitHub', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-GitHub-config.yml',
      function before() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let documentation = confit['generator-confit'].documentation;

        assert.equal(documentation, undefined);
      },
      function after() {
        yoassert.file(['confit.yml']);

        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let docConfig = confit['generator-confit'].documentation;

        assert.equal(docConfig.generateDocs, true);
        assert.equal(docConfig.srcDir, 'docs/');
        assert.equal(docConfig.outputDir, 'docs-website/');
        assert.equal(docConfig.publishMethod, 'GitHub');
        assert.equal(docConfig.createSampleDocs, true);
        done();
      }
    );
  });


  it('should not ask for extra values when the user does not want documentation', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {},
      function after() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let docConfig = confit['generator-confit'].documentation;

        assert.equal(docConfig.generateDocs, false);
        assert.equal(docConfig.srcDir, undefined);
        assert.equal(docConfig.outputDir, undefined);
        assert.equal(docConfig.publishMethod, undefined);
        assert.equal(docConfig.createSampleDocs, undefined);
        done();
      }
    ).withPrompts({
      generateDocs: false
    });
  });


  it('should allow the default values to be changed', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {},
      function after() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let docConfig = confit['generator-confit'].documentation;

        assert.equal(docConfig.generateDocs, true);
        assert.equal(docConfig.srcDir, 'a/b/c/');
        assert.equal(docConfig.outputDir, 'magic-johnson/');
        assert.equal(docConfig.publishMethod, 'GitHub');
        done();
      }
    ).withPrompts({
      generateDocs: true,
      srcDir: 'a/b/c',
      outputDir: 'magic-johnson/',
      publishMethod: 'GitHub'
    });
  });


  it('should generate the correct config for generating the documentation for the default settings', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {},
      function after() {
        yoassert.file(['package.json', 'config/docs/publish.js', 'config/docs/serve.dev.js']);

        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts['docs:dev'], 'NODE_ENV=development node config/docs/serve.dev.js');
        assert.equal(pkg.scripts['docs:build'], 'NODE_ENV=production webpack -p --progress --config config/docs/swanky.webpack.config.js --colors');
        assert.equal(pkg.scripts['docs:build:serve'], 'npm-run-all docs:build docs:serve');
        assert.equal(pkg.scripts['docs:serve'], 'http-server docs-website/ -o');
        assert.equal(pkg.scripts['docs:publish'], 'npm-run-all docs:build node config/docs/publish.js');
        done();
      }
    );
  });


  it('should generate the correct config for generating the documentation for Github publishing', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {},
      function after() {
        yoassert.file(['package.json', 'config/docs/publish.js', 'config/docs/serve.dev.js']);

        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts['docs:dev'], 'NODE_ENV=development node config/docs/serve.dev.js');
        assert.equal(pkg.scripts['docs:build'], 'NODE_ENV=production webpack -p --progress --config config/docs/swanky.webpack.config.js --colors');
        assert.equal(pkg.scripts['docs:build:serve'], 'npm-run-all docs:build docs:serve');
        assert.equal(pkg.scripts['docs:serve'], 'http-server docs-website/ -o');
        assert.equal(pkg.scripts['docs:publish'], 'npm-run-all docs:build node config/docs/publish.js');
        done();
      }
    ).withPrompts({
      publishMethod: 'GitHub'
    });
  });


  it('should generate the correct config for generating the documentation for cloud publishing', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {},
      function after() {
        yoassert.file(['package.json', 'config/docs/serve.dev.js']);

        let pkg = fs.readJsonSync('package.json');

        assert.equal(pkg.scripts['docs:dev'], 'NODE_ENV=development node config/docs/serve.dev.js');
        assert.equal(pkg.scripts['docs:build'], 'NODE_ENV=production webpack -p --progress --config config/docs/swanky.webpack.config.js --colors');
        assert.equal(pkg.scripts['docs:build:serve'], 'npm-run-all docs:build docs:serve');
        assert.equal(pkg.scripts['docs:serve'], 'http-server docs-website/ -o');
        assert.equal(pkg.scripts['docs:publish'], 'npm-run-all docs:build ns docs-website/');
        done();
      }
    ).withPrompts({
      publishMethod: 'cloud'
    });
  });



  it('should convert invalid paths into valid paths', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-documentation-config.yml',
      function before() {},
      function after() {
        let confit = yaml.load(fs.readFileSync('confit.yml'));
        let docConfig = confit['generator-confit'].documentation;

        assert.equal(docConfig.srcDir, 'dotSlash/');
        assert.equal(docConfig.outputDir, 'docs-website/');        // Changed to the default directory
        done();
      }
    ).withPrompts({
      generateDocs: true,
      srcDir: './dotSlash/',
      outputDir: '   ',
      publishMethod: 'GitHub'
    });
  });


  it('should throw an error if a path contains ../', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-paths-config.json',
      function before() {},
      function after() {},
      function error(err) {
        assert.equal(err.message, '"outputDir" cannot contain "../"');
        done();
      }
    ).withPrompts({
      outputDir: 'a/../b//c/d'
    });
  });


  it('should throw an error if a path is an absolute path', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'node-paths-config.json',
      function before() {},
      function after() {},
      function error(err) {
        assert.equal(err.message, '"srcDir" cannot be an absolute path: /full/path/dir');
        done();
      }
    ).withPrompts({
      srcDir: '/full/path/dir'
    });
  });


  it('should generate the correct README.md documentation', (done) => {
    utils.runGenerator(
      'zzfinish',
      'node-documentation-zzfinish-config.yml',
      // 'zzFinish-config.json',
      function before(testDir) {
        // Create a package.json file as the generator expects it will exist
        fs.writeJsonSync(testDir + '/package.json', {
          name: 'some-name',
          description: 'desc'
        });
        yoassert.file(['package.json']);
      },
      function after() {
        yoassert.file(['README.md', 'CONTRIBUTING.md']);

        let text = fs.readFileSync('CONTRIBUTING.md', 'utf-8').split('\n');

        console.log(fs.readFileSync('CONTRIBUTING.md', 'utf-8'));
        // assert.notEqual(readmeText.indexOf('<!--[CN_HEADING]-->'), -1);
        //
        // assert.equal(pkg.scripts['docs:dev'], 'NODE_ENV=development node config/docs/serve.dev.js');
        // assert.equal(pkg.scripts['docs:build'], 'NODE_ENV=production webpack -p --progress --config config/docs/swanky.webpack.config.js --colors');
        // assert.equal(pkg.scripts['docs:build:serve'], 'npm-run-all docs:build docs:serve');
        // assert.equal(pkg.scripts['docs:serve'], 'http-server docs-website/ -o');
        // assert.equal(pkg.scripts['docs:publish'], 'npm-run-all docs:build node config/docs/publish.js');
        done();
      }
    );
  });

});
