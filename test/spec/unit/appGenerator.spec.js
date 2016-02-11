'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var yoassert = require('yeoman-assert');
var assert = require('assert');
var fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'app';


function runGenerator(confitFixture, beforeTestCb, assertionCb) {
  var generatorName = path.join(__dirname, '../../../generators/' + GENERATOR_UNDER_TEST);
  var testDir;

  helpers.run(generatorName)
    .inTmpDir(function (dir) {
      // Copy the confit.json fixture here
      if (confitFixture) {
        fs.copySync(path.join(__dirname, confitFixture), path.join(dir, 'confit.json'));
      }
      testDir = dir;
      beforeTestCb(testDir);
    })
    .withArguments(['--force=true'])    // Any file-conflicts, over-write
    .withGenerators([
      [helpers.createDummyGenerator(), 'confit:build'],
      [helpers.createDummyGenerator(), 'confit:buildAssets'],
      [helpers.createDummyGenerator(), 'confit:buildCSS'],
      [helpers.createDummyGenerator(), 'confit:buildHTML'],
      [helpers.createDummyGenerator(), 'confit:buildJS'],
      [helpers.createDummyGenerator(), 'confit:entryPoint'],
      [helpers.createDummyGenerator(), 'confit:paths'],
      [helpers.createDummyGenerator(), 'confit:sampleApp'],
      [helpers.createDummyGenerator(), 'confit:serverDev'],
      [helpers.createDummyGenerator(), 'confit:serverProd'],
      [helpers.createDummyGenerator(), 'confit:testBrowser'],
      [helpers.createDummyGenerator(), 'confit:testUnit'],
      [helpers.createDummyGenerator(), 'confit:verify'],
      [helpers.createDummyGenerator(), 'confit:zzfinish']
    ])
    .withPrompts({
      buildProfile: 'Latest'
    })
    .withOptions({
      skipInstall: true,
      skipRun: true
    })
    //.on('ready', function() {
    //
    //})
    .on('end', function() {
      assertionCb(testDir);
    });
}


describe('App Generator', function () {

  it('should create a confit.json, .editorConfig and package.json file when they do not exist', function(done) {
    // How to prove
    runGenerator(null,
      function beforeTest() {
        yoassert.noFile(['confit.json', '.editorconfig', 'package.json']);
      },
      function afterTest() {
        yoassert.file(['confit.json', '.editorconfig', 'package.json']);
        done();
      }
    );
  });


  it('should create a confit.json file with valid data inside it', function(done) {
    runGenerator(null,
      function beforeTest() {},
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

    runGenerator(null,
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

    runGenerator(null,
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
});
