'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'zzfinish';

describe('zzFinish Generator', () => {

  it('should generate a README.md file with the appropriate sections and content', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'zzFinish-config.json',
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

        let readmeText = fs.readFileSync('README.md', 'utf-8').split('\n');

        assert.notEqual(readmeText.indexOf('<!--[RM_HEADING]-->'), -1);
        assert.notEqual(readmeText.indexOf('# some-name'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_DESCRIPTION]-->'), -1);
        assert.notEqual(readmeText.indexOf('> desc'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_INSTALL]-->'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_NEXT_STEPS]-->'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_CONTRIBUTING]-->'), -1);
        assert.notEqual(readmeText.indexOf('<!--[RM_LICENSE]-->'), -1);
        assert.notEqual(readmeText.indexOf('This software does not have a license.'), -1, 'correct license text when UNLICENSED');
        done();
      }
    );
  });

  it('should generate a README.md file with different license content when the app has a license', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'zzFinish-withLicense.json',
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

        let readmeText = fs.readFileSync('README.md', 'utf-8').split('\n');

        assert.notEqual(readmeText.indexOf('<!--[RM_LICENSE]-->'), -1);
        assert.notEqual(readmeText.indexOf('This software is licensed under the MIT Licence. See [LICENSE](LICENSE).'), -1, 'correct license text when LICENSED');
        done();
      }
    );
  });

  it('should generate a CONTRIBUTING.md file with the appropriate sections and content', (done) => {
    utils.runGenerator(
      GENERATOR_UNDER_TEST,
      'zzFinish-config.json',
      function before(testDir) {
        yoassert.noFile(['CONTRIBUTING.md']);

        // Create a package.json file as the generator expects it will exist
        fs.writeJsonSync(testDir + '/package.json', {
          name: 'some-name',
          description: 'desc'
        });
        yoassert.file(['package.json']);
      },
      function after() {
        yoassert.file(['CONTRIBUTING.md']);

        let readmeText = fs.readFileSync('CONTRIBUTING.md', 'utf-8').split('\n');

        assert.notEqual(readmeText.indexOf('<!--[CN_HEADING]-->'), -1);
        done();
      }
    );
  });
});
