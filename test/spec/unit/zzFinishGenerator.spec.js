'use strict';

const utils = require('./unitTestUtils');
const yoassert = require('yeoman-assert');
const assert = require('assert');
const fs = require('fs-extra');

const GENERATOR_UNDER_TEST = 'zzfinish';

describe('zzFinish Generator', () => {
  describe('should generate a README.md file', () => {
    it('with the appropriate sections and content', done => {
      utils.runGenerator(
        GENERATOR_UNDER_TEST,
        'zzFinish-browser-config.json',
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

          let readmeText = fs.readFileSync('README.md', 'utf8').split('\n');

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


    it('with different license content when the app has a license', done => {
      utils.runGenerator(
        GENERATOR_UNDER_TEST,
        'zzFinish-node-withLicense.json',
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

          let readmeText = fs.readFileSync('README.md', 'utf8').split('\n');

          assert.notEqual(readmeText.indexOf('<!--[RM_LICENSE]-->'), -1);
          assert.notEqual(readmeText.indexOf('This software is licensed under the MIT Licence. See [LICENSE](LICENSE).'), -1, 'correct license text when LICENSED');
          done();
        }
      );
    });
  });


  describe('should generate a CONTRIBUTING.md file', () => {
    it('with the appropriate sections and content', done => {
      utils.runGenerator(
        GENERATOR_UNDER_TEST,
        'zzFinish-browser-config.json',
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

          let readmeText = fs.readFileSync('CONTRIBUTING.md', 'utf8').split('\n');

          assert.notEqual(readmeText.indexOf('<!--[CN_HEADING]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_GETTING_STARTED]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[RM_DIR_STRUCTURE]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_GITFLOW_PROCESS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_BUILD_TASKS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_TEST_TASKS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_VERIFY_TASKS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_COMMIT_TASKS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_DOCUMENTATION_TASKS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_RELEASE_TASKS]-->'), -1);
          assert.notEqual(readmeText.indexOf('<!--[CN_CHANGING_BUILD_TOOL_CONFIG]-->'), -1);

          done();
        }
      );
    });


    it('with a directory structure for Browser projects', done => {
      utils.runGenerator(
        GENERATOR_UNDER_TEST,
        'zzFinish-browser-config.json',
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
          let readmeText = fs.readFileSync('CONTRIBUTING.md', 'utf8');

          // The directory names come from the confit.json config (above)
          assert.notEqual(readmeText.search(/config\/.* configuration files live here/), -1, 'config dir');

          assert.notEqual(readmeText.search(/src\/.* source code files should be here/), -1, 'source dir');
          assert.notEqual(readmeText.search(/modules\/.* all source code modules|components|features should appear as sub-directories under this directory/), -1, 'modules dir');
          assert.notEqual(readmeText.search(/assets\//), -1, 'assets dir');
          assert.notEqual(readmeText.search(/styles\/.* css source code for this module/), -1, 'styles dir');
          assert.notEqual(readmeText.search(/templates\/.* HTML templates for this module/), -1, 'templates dir');
          assert.notEqual(readmeText.search(/unitTest\/.* unit test specs for this module/), -1, 'unitTestDir dir');
          assert.notEqual(readmeText.search(/systemTest\/.* system test specs for this module/), -1, 'systemTest dir');

          assert.notEqual(readmeText.search(/dev\/.* development-build code is output here/), -1, 'dev dir');
          assert.notEqual(readmeText.search(/dist\/.* production-build code is output here/), -1, 'prod dir');
          assert.notEqual(readmeText.search(/assets\/.* all assets appear here, under module sub-folders/), -1, 'assets sub dir');
          assert.notEqual(readmeText.search(/css\/.* compiled CSS files/), -1, 'css dir');
          assert.notEqual(readmeText.search(/js\/.* minified JS files/), -1, 'js dir');
          assert.notEqual(readmeText.search(/vendor\/.* minified vendor JS files/), -1, 'vendor dir');

          assert.notEqual(readmeText.search(/reports\/.* test reports appear here/), -1, 'reports dir');
          assert.equal(readmeText.search(/docs\/.* source\/content for the documentation website goes here/), -1, 'no docs.srcDir dir');
          assert.equal(readmeText.search(/docs\-website\/.* the documentation website is generated here/), -1, 'no docs.outputDir dir');

          assert.notEqual(readmeText.search(/confit\.json.* the project config file generated by 'yo confit'/), -1, 'config file');
          assert.notEqual(readmeText.search(/CONTRIBUTING\.md.* how to contribute to the project/), -1, 'CONTRIBUTING.md');
          assert.notEqual(readmeText.search(/README\.md.* this file/), -1, 'README.md');
          assert.notEqual(readmeText.search(/package\.json.* NPM package description file/), -1, 'package.json');

          done();
        }
      );
    });

    it('with a directory structure for Node projects', done => {
      utils.runGenerator(
        GENERATOR_UNDER_TEST,
        'zzFinish-node-withLicense.json',
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
          let readmeText = fs.readFileSync('CONTRIBUTING.md', 'utf8');

          // The directory names come from the confit.json config (above)
          assert.notEqual(readmeText.search(/config\/.* configuration files live here/), -1, 'config dir');

          assert.notEqual(readmeText.search(/src\/.* source code files should be here/), -1, 'source dir');
          assert.notEqual(readmeText.search(/unitTest\/.* unit test specifications live here/), -1, 'unitTestDir dir');

          assert.notEqual(readmeText.search(/dist\/.* production-build code should live here/), -1, 'prod dir');

          assert.notEqual(readmeText.search(/reports\/.* test reports appear here/), -1, 'reports dir');
          assert.notEqual(readmeText.search(/docs\/.* source\/content for the documentation website goes here/), -1, 'docs.srcDir dir');
          assert.notEqual(readmeText.search(/webdocs\/.* the documentation website is generated here/), -1, 'docs.outputDir dir');

          assert.notEqual(readmeText.search(/confit\.json.* the project config file generated by 'yo confit'/), -1, 'config file');
          assert.notEqual(readmeText.search(/CONTRIBUTING\.md.* how to contribute to the project/), -1, 'CONTRIBUTING.md');
          assert.notEqual(readmeText.search(/README\.md.* this file/), -1, 'README.md');
          assert.notEqual(readmeText.search(/package\.json.* NPM package description file/), -1, 'package.json');
          done();
        }
      );
    });
  });
});
