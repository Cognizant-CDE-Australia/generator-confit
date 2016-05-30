'use strict';

const helpers = require('yeoman-test');
const utils = require('./unitTestUtils');
const path = require('path');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'app';

function runGenerator(confitFixture, beforeTestCb, assertionCb) {
  return utils.runGenerator(
    GENERATOR_UNDER_TEST,
    confitFixture,
    beforeTestCb,
    assertionCb
  ).withGenerators([
    [helpers.createDummyGenerator(), 'confit:buildBrowser'],
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
  ]);
}


describe('App Generator', function () {

  it('should add an "app" section to the confit.json file with valid data inside it', function(done) {
    runGenerator('app-config.json',
      function beforeTest() {
        let confit = fs.readJsonSync('confit.json');
        assert.equal(confit['generator-confit'].app, undefined);
      },
      function afterTest() {
        let confit = fs.readJsonSync('confit.json');
        let app = confit['generator-confit'].app;

        assert.equal(typeof app, 'object');
        assert.equal(typeof app.buildProfile, 'string');
        assert.equal(typeof app.projectType, 'string');
        assert.equal(typeof app._version, 'string');

        // Verify that the buildProfile values have no spaces in them (they should be the simple key, not the label)
        assert(app.buildProfile.indexOf(' ') === -1, 'buildProfile is a simple key');

        //fs.readdirSync(testDir).forEach(file => console.log(file));
        done();
      }
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'UNLICENSED'
    });
  });


  it('should create an .editorConfig and package.json file when they do not exist', function(done) {
    var filesThatShouldBeGenerated = ['.editorconfig', 'package.json'];
    runGenerator('app-config.json',
      function beforeTest() {
        yoassert.noFile(filesThatShouldBeGenerated);
      },
      function afterTest() {
        yoassert.file(filesThatShouldBeGenerated);
        done();
      }
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'UNLICENSED'
    });
  });


  it('should not create a license file when the license type is UNLICENSED', function(done) {
    runGenerator('app-config.json',
      function beforeTest() {
        yoassert.noFile('LICENSE');
      },
      function afterTest() {
        yoassert.noFile('LICENSE');
        done();
      }
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'UNLICENSED'
    });
  });


  it('should create a license file when the license type is valid, and it should contain the copyrightOwner and year inside', function(done) {
    runGenerator('app-withCopyrightOwner.json',
      function beforeTest() {
        yoassert.noFile('LICENSE');
      },
      function afterTest(dir) {
        yoassert.file('LICENSE');

        let confit = fs.readJsonSync('confit.json');
        let expectedCopyrightOwner = confit['generator-confit'].app.copyrightOwner;
        assert.ok(expectedCopyrightOwner, 'expectedCopyrightOwner is not falsy');

        let licenseText = fs.readFileSync('LICENSE', 'utf-8');
        let year = (new Date()).getFullYear();
        assert.notEqual(licenseText.indexOf('Copyright (c) ' + year + ' ' + expectedCopyrightOwner), -1, 'Copyright message is in the correct format');
        done();
      }
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'MIT'
    });
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
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'UNLICENSED'
    });
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
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'UNLICENSED'
    });
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
    ).withPrompts({
      buildProfile: 'Latest',
      license: 'UNLICENSED'
    });
  });
});
