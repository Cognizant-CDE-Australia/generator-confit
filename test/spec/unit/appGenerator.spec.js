'use strict';

const helpers = require('yeoman-test');
const utils = require('./unitTestUtils');
const path = require('path');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'app';


function runGenerator(confitFixture, beforeTestCb, assertionCb) {
  utils.runGenerator(
    GENERATOR_UNDER_TEST,
    confitFixture,
    beforeTestCb,
    assertionCb
  ).withGenerators([
    [helpers.createDummyGenerator(), 'confit:build'],
    [helpers.createDummyGenerator(), 'confit:buildAssets'],
    [helpers.createDummyGenerator(), 'confit:buildCSS'],
    [helpers.createDummyGenerator(), 'confit:buildHTML'],
    [helpers.createDummyGenerator(), 'confit:buildJS'],
    [helpers.createDummyGenerator(), 'confit:entryPoint'],
    [helpers.createDummyGenerator(), 'confit:paths'],
    [helpers.createDummyGenerator(), 'confit:release'],
    [helpers.createDummyGenerator(), 'confit:sampleApp'],
    [helpers.createDummyGenerator(), 'confit:serverDev'],
    [helpers.createDummyGenerator(), 'confit:serverProd'],
    [helpers.createDummyGenerator(), 'confit:testBrowser'],
    [helpers.createDummyGenerator(), 'confit:testUnit'],
    [helpers.createDummyGenerator(), 'confit:verify'],
    [helpers.createDummyGenerator(), 'confit:zzfinish']
  ]).withPrompts({
    buildProfile: 'Latest'
  });
}


describe('App Generator', function () {

  it('should be a dummy test', () => {});

  xit('should create an .editorConfig and package.json file when they do not exist', function(done) {
    var filesThatShouldBeGenerated = ['.editorconfig', 'package.json'];
    runGenerator('app-config.json',
      function beforeTest() {
        yoassert.noFile(filesThatShouldBeGenerated);
      },
      function afterTest() {
        yoassert.file(filesThatShouldBeGenerated);
        done();
      }
    );
  });


  it('should add an "app" section to the confit.json file with valid data inside it', function(done) {
    runGenerator('app-config.json',
      function beforeTest() {
        var confit = fs.readJsonSync('confit.json');
        assert.equal(confit['generator-confit'].app, undefined);
      },
      function afterTest() {
        var confit = fs.readJsonSync('confit.json');
        assert.equal(typeof confit['generator-confit'].app, 'object');
        assert.equal(typeof confit['generator-confit'].app.buildProfile, 'string');
        assert.equal(typeof confit['generator-confit'].app.browserSupport, 'object');
        assert(confit['generator-confit'].app.browserSupport.length > 0, 'browser support length is greater than 0');
        assert.equal(typeof confit['generator-confit'].app._version, 'string');

        // Verify that the buildProfile and browser support values have no spaces in them
        // (they should be the simple key, not the label)
        assert(confit['generator-confit'].app.buildProfile.indexOf(' ') === -1, 'buildProfile is a simple key');
        assert(confit['generator-confit'].app.browserSupport[0].indexOf(' ') === -1, 'browserSupport is a simple key');

        //fs.readdirSync(testDir).forEach(file => console.log(file));
        done();
      }
    );
  });


  it('should not overwrite an existing .editorconfig file', function(done) {
    var originalContents = 'dummy data' + (new Date());

    runGenerator('app-config.json',
      function beforeTest(testDir) {
        fs.writeFileSync(path.join(testDir, '.editorconfig'), originalContents);
      },
      function afterTest(testDir) {
        var newContents = fs.readFileSync(path.join(testDir, '.editorconfig'));
        assert.equal(originalContents, newContents);
        done();
      }
    );
  });


  it('should not overwrite an existing package.json file with a template, but will add additional data', function(done) {
    var originalContents = { name: 'name-is-required', description: 'abc' };

    runGenerator('app-config.json',
      function beforeTest(testDir) {
        fs.writeJsonSync(testDir + '/package.json', originalContents);
        //fs.readdirSync(testDir).forEach(file => console.log('b', file));
        //var contents = fs.readJsonSync(path.join(testDir, 'package.json'));
      },
      function afterTest(testDir) {
        var newContents = fs.readJsonSync(testDir + '/package.json');
        assert.equal(newContents.name, originalContents.name);
        assert.equal(newContents.description, originalContents.description);
        assert.equal(typeof newContents.devDependencies, 'object');
        done();
      }
    );
  });

  it('should generate scripts in package.json', function(done) {
    runGenerator('app-config.json',
      function before(testDir) {
        yoassert.noFile(['package.json']);

        // Create a package.json file as the generator expects it will exist
        fs.writeJsonSync(testDir + '/package.json', {
          name: 'some-name',
          description: 'desc'
        });
        yoassert.file(['package.json']);
      },
      function after() {
        var pkg = fs.readJsonSync('package.json');
        assert.equal(pkg.scripts.start, 'npm run dev');
        assert.ok(pkg.scripts.dev);
        assert.ok(pkg.scripts.build);
        assert.ok(pkg.scripts['build:serve']);
        assert.ok(pkg.scripts['clean:dev']);
        assert.ok(pkg.scripts['clean:prod']);
        done();
      }
    );
  });
});
