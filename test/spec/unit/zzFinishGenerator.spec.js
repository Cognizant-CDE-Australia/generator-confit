'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'zzfinish';

describe('zzFinish Generator', function () {

  it('should generate scripts in package.json', function(done) {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'fixtures/zzFinish-config.json',
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


  it('should generate a README.md file with the appropriate sections and content', function(done) {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'fixtures/zzFinish-config.json',
      function before(testDir) {
        yoassert.noFile(['README.md']);

        // Create a package.json file as the generator expects it will exist
        fs.writeJsonSync(testDir + '/package.json', {
          name: 'some-name',
          description: 'desc'
        });
        yoassert.file(['package.json']);
      },
      function after() {
        yoassert.file(['README.md']);

        var readmeText = fs.readFileSync('README.md', 'utf-8').split('\n');
        assert.notEqual(readmeText.indexOf('<!--[RM_HEADING]-->'), -1);
        assert.notEqual(readmeText.indexOf('# some-name'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_DESCRIPTION]-->'), -1);
        assert.notEqual(readmeText.indexOf('> desc'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_INSTALL]-->'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_DEVELOPMENT_TASKS]-->'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_BUILD_TOOL_FEATURES]-->'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_CHANGING_BUILD_TOOL_CONFIG]-->'), -1);
        done();
      }
    );
  });
});
